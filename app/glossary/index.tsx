import {useState} from 'react';
import {useRouter, type Href} from 'expo-router';
import {glossaryEntries} from '@/data/glossary';
import {Button,Copy,Field,Shell} from '@/training/ui';
export default function Glossary(){const [query,setQuery]=useState(''),router=useRouter();return <Shell title="术语词典"><Copy>仅解释名词；今日剂量看今天页，营养建议看饮食与营养。</Copy><Field label="搜索术语" value={query} onChange={setQuery}/>{glossaryEntries.filter(e=>(e.term+' '+e.fullName+' '+e.shortDefinition).toLowerCase().includes(query.toLowerCase())).map(e=><Button key={e.id} title={e.term+' · '+e.shortDefinition} onPress={()=>router.push(('/glossary/'+e.id) as Href)}/>)}</Shell>;}
