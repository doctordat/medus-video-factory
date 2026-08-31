import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {aspirinScenes} from './data/aspirin';
const duration=aspirinScenes.reduce((n,s)=>n+s.duration,0);
export const Root:React.FC=()=> <Composition id="AspirinShort" component={Video} width={1080} height={1920} fps={30} durationInFrames={duration} defaultProps={{scenes:aspirinScenes}}/>;
