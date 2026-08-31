import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import type {Scene} from './types';
import {theme} from './theme';

const Frame:React.FC<React.PropsWithChildren> = ({children}) => <AbsoluteFill style={{backgroundColor:theme.bg,backgroundImage:`linear-gradient(${theme.grid}55 1px,transparent 1px),linear-gradient(90deg,${theme.grid}55 1px,transparent 1px)`,backgroundSize:'48px 48px',fontFamily:'Arial,sans-serif',color:theme.ink}}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',padding:90,textAlign:'center'}}>{children}</div></AbsoluteFill>;

const SceneView:React.FC<{scene:Scene}> = ({scene}) => {
 const f=useCurrentFrame(); const opacity=interpolate(f,[0,10],[0,1],{extrapolateRight:'clamp'});
 const wrap=(x:React.ReactNode)=><Frame><div style={{opacity}}>{x}</div></Frame>;
 if(scene.type==='title') return wrap(<><div style={{fontSize:112,fontWeight:900}}>{scene.text}</div>{scene.subtext&&<div style={{fontSize:42,marginTop:28,background:theme.yellow,padding:'10px 24px'}}>{scene.subtext}</div>}</>);
 if(scene.type==='target') return wrap(<><div style={{fontSize:66,fontWeight:900,background:theme.yellow,padding:'12px 24px'}}>{scene.drug}</div><div style={{fontSize:110,margin:35}}>↓</div><div style={{fontSize:100,fontWeight:900}}>{scene.target}</div>{scene.action&&<div style={{fontSize:42,color:theme.red,fontWeight:900,marginTop:28}}>{scene.action}</div>}</>);
 if(scene.type==='pathway') return wrap(<><div style={{fontSize:72,fontWeight:800}}>{scene.from}</div><div style={{fontSize:130,color:theme.red,margin:25}}>{scene.direction==='down'?'↓':scene.direction==='block'?'✕':'→'}</div><div style={{fontSize:72,fontWeight:900}}>{scene.to}</div></>);
 if(scene.type==='clinical') return wrap(<div style={{fontSize:92,fontWeight:900,background:theme.yellow,padding:'16px 28px'}}>{scene.text}</div>);
 return wrap(<><div style={{fontSize:48,color:theme.red,fontWeight:900}}>LƯU Ý</div><div style={{fontSize:92,fontWeight:900,marginTop:28}}>{scene.text}</div></>);
};

export const Video:React.FC<{scenes:Scene[]}> = ({scenes}) => {let cursor=0;return <>{scenes.map((scene,i)=>{const from=cursor;cursor+=scene.duration;return <Sequence key={i} from={from} durationInFrames={scene.duration}><SceneView scene={scene}/></Sequence>})}</>};
