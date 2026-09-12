import { useLocalSearchParams } from 'expo-router';
import { getExerciseById } from '@/data/exercises';
import { teachingById } from '@/data/exerciseTeaching';
import { Copy, Panel, Shell, TeachingView } from './ui';
export default function ExerciseLibrary(){
 const {id}=useLocalSearchParams<{id:string}>(),ex=getExerciseById(id),t=teachingById[id];
 if(!ex)return <Shell title="动作未找到"><Copy>请从更多中的动作库重新选择。</Copy></Shell>;
 return <Shell title={ex.nameZh}><Panel warning><Copy>动作库用于学习，不是今天的处方。待核实条目不自动推荐；学习教程不代表已经具备训练资格。</Copy></Panel><TeachingView teaching={t}/>{t.status==='edited'?<Copy>疼痛达到3/10、持续上升或动作明显改变时停止诱发动作。3/10是本App的保守停止规则，不是诊断标准。任何替代也须当前舒适。</Copy>:null}</Shell>;
}
