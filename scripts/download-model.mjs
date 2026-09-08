import { mkdir, writeFile, access } from 'node:fs/promises';
const model='Xenova/all-MiniLM-L6-v2';
for(const file of ['config.json','tokenizer.json','tokenizer_config.json','special_tokens_map.json','onnx/model_quantized.onnx']){
 const target=`public/models/${model}/${file}`;
 try{await access(target);console.log(`Cached ${file}`);continue;}catch{}
 const res=await fetch(`https://huggingface.co/${model}/resolve/main/${file}`);
 if(!res.ok)throw new Error(`Model download ${res.status}: ${file}`);
 await mkdir(target.substring(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,new Uint8Array(await res.arrayBuffer()));console.log(`Downloaded ${file}`);
}
