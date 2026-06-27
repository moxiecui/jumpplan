const { spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");
const port = 4177;
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".png", "image/png"],
  [".json", "application/json; charset=utf-8"]
]);

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function exportWeb() {
  runNode(["node_modules/expo/bin/cli", "export", "-p", "web"]);
  runNode([".tools/copy-gh-pages-404.js"]);
}

function createStaticServer() {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      let pathname = decodeURIComponent(url.pathname);

      if (pathname.startsWith("/jumpplan")) {
        pathname = pathname.slice("/jumpplan".length) || "/";
      }

      const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      let filePath = path.normalize(path.join(distRoot, relativePath));

      if (!filePath.startsWith(distRoot)) {
        filePath = path.join(distRoot, "index.html");
      }

      try {
        const data = await fs.readFile(filePath);
        response.setHeader("Content-Type", mimeTypes.get(path.extname(filePath)) || "application/octet-stream");
        response.end(data);
      } catch {
        const data = await fs.readFile(path.join(distRoot, "index.html"));
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(data);
      }
    } catch (error) {
      response.statusCode = 500;
      response.end(String(error));
    }
  });
}

async function main() {
  exportWeb();

  const server = createStaticServer();
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`http://127.0.0.1:${port}/jumpplan/`, { waitUntil: "networkidle" });
    const todayText = await page.locator("body").innerText();
    const todayOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    await page.screenshot({ path: path.join(distRoot, "ui-review-today.png"), fullPage: true });

    await page.getByText("查看指导 ›").first().click();
    const detailsVisible = await page.getByText("训练目的").first().isVisible();
    await page.getByText("完成", { exact: true }).first().click();
    const summaryText = await page.getByText(/个动作已有记录/).first().innerText();

    await page.getByText("计划", { exact: true }).first().click();
    await page.waitForLoadState("networkidle");
    const planText = await page.locator("body").innerText();
    const planOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    await page.screenshot({ path: path.join(distRoot, "ui-review-plan.png"), fullPage: true });

    const results = {
      today: {
        hasCurrentDay: /第 \d+ 天/.test(todayText),
        hasTraining: todayText.includes("今日训练内容"),
        hasCompletion: todayText.includes("今日训练总结"),
        hasCompactNav: ["计划", "状态", "营养", "术语"].every((label) => todayText.includes(label)),
        horizontalOverflow: todayOverflow,
        detailsVisible,
        summaryText
      },
      plan: {
        has21DayTitle: planText.includes("21天计划"),
        hasOpenHint: planText.includes("查看训练 ›"),
        horizontalOverflow: planOverflow
      },
      errors
    };

    await browser.close();
    console.log(JSON.stringify(results, null, 2));

    const failed =
      !results.today.hasCurrentDay ||
      !results.today.hasTraining ||
      !results.today.hasCompletion ||
      !results.today.hasCompactNav ||
      results.today.horizontalOverflow ||
      !results.today.detailsVisible ||
      !results.plan.has21DayTitle ||
      !results.plan.hasOpenHint ||
      results.plan.horizontalOverflow ||
      results.errors.length > 0;

    if (failed) {
      process.exitCode = 1;
    }
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
