export type Scene =
  | {type:'title'; text:string; subtext?:string; duration:number}
  | {type:'target'; drug:string; target:string; action?:string; duration:number}
  | {type:'pathway'; from:string; to:string; direction?:'up'|'down'|'block'; duration:number}
  | {type:'clinical'; text:string; duration:number}
  | {type:'warning'; text:string; duration:number};
