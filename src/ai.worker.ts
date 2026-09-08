import { pipeline, env } from '@huggingface/transformers';
import { MODEL } from './engine';
env.allowRemoteModels=false;
env.allowLocalModels=true;
env.localModelPath='/models/';
env.backends.onnx.wasm!.numThreads=1;
let extractor:Promise<any>|undefined;
const cache=new Map<string,number[]>();
self.onmessage=async(event:MessageEvent<{id:number;texts:string[]}>)=>{
 const {id,texts}=event.data;
 try{
 extractor??=pipeline('feature-extraction',MODEL,{dtype:'q8',device:'wasm',progress_callback:(p:any)=>self.postMessage({id,type:'progress',message:p.status==='progress'?`Loading private AI · ${Math.round(p.progress??0)}%`:'Preparing private AI…'})});
 const model=await extractor;const vectors:number[][]=[];
 for(const text of texts){let vector=cache.get(text);if(!vector){const result=await model(text,{pooling:'mean',normalize:true});vector=Array.from(result.data) as number[];if(cache.size>=200)cache.delete(cache.keys().next().value!);cache.set(text,vector);}vectors.push(vector);}
 self.postMessage({id,type:'result',vectors});
 }catch(error){extractor=undefined;self.postMessage({id,type:'error',message:'Local AI could not load. Check the model download and retry. '+String(error)});}
};
