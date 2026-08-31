import type {Scene} from '../types';
export const aspirinScenes: Scene[] = [
 {type:'title',text:'CƠ CHẾ ASPIRIN',subtext:'Trong 30 giây',duration:75},
 {type:'target',drug:'ASPIRIN',target:'COX-1',action:'ỨC CHẾ KHÔNG HỒI PHỤC',duration:105},
 {type:'pathway',from:'THROMBOXANE A2',to:'KẾT TẬP TIỂU CẦU',direction:'down',duration:105},
 {type:'clinical',text:'↓ KẾT TẬP TIỂU CẦU',duration:105},
 {type:'warning',text:'TĂNG NGUY CƠ CHẢY MÁU',duration:105}
];
