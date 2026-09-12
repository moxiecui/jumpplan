import {useLocalSearchParams} from 'expo-router';
import {glossaryEntries} from '@/data/glossary';
import {Copy,Shell} from '@/training/ui';
export default function Term(){const {id}=useLocalSearchParams<{id:string}>(),e=glossaryEntries.find(x=>x.id===id);return <Shell title={e?.term??'术语未找到'}><Copy>{e?.fullName}</Copy><Copy>{e?.shortDefinition}</Copy><Copy muted>名词说明不生成训练或补剂处方；今天页负责训练剂量，饮食与营养页解释证据与适用条件。</Copy></Shell>;}
