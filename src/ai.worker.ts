import { pipeline, env } from '@huggingface/transformers';
import { MODEL } from './engine';
env.allowRemoteModels=false;
env.allowLocalModels=true;
env.localModelPath='/models/';
// Multi-threaded WASM needs crossOriginIsolated (COOP/COEP headers); fall back to a single thread otherwise.
env.backends.onnx.wasm!.numThreads=(globalThis as{crossOriginIsolated?:boolean}).crossOriginIsolated?Math.min(4,navigator.hardwareConcurrency||1):1;
let extractor:Promise<any>|undefined;
const cache=new Map<string,number[]>();
self.onmessage=async(event:MessageEvent<{id:number;texts?:string[];warm?:boolean}>)=>{
 const {id,texts,warm}=event.data;
 try{
 extractor??=pipeline('feature-extraction',MODEL,{dtype:'q8',device:'wasm',progress_callback:(p:any)=>self.postMessage({id,type:'progress',message:p.status==='progress'?`Loading private AI · ${Math.round(p.progress??0)}%`:'Preparing private AI…'})});
 const model=await extractor;
 if(warm&&!texts){self.postMessage({id,type:'warm'});return;}
 if(!texts)throw new Error('No text provided');
 const vectors:number[][]=[];
 for(const text of texts){let vector=cache.get(text);if(!vector){const result=await model(text,{pooling:'mean',normalize:true});vector=Array.from(result.data) as number[];if(cache.size>=200)cache.delete(cache.keys().next().value!);cache.set(text,vector);}vectors.push(vector);}
 self.postMessage({id,type:'result',vectors});
 }catch(error){extractor=undefined;self.postMessage({id,type:'error',message:'Local AI could not load. Check the model download and retry. '+String(error)});}
};
