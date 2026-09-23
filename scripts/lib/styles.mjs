import { typographyCss } from './typography.mjs';

export const SHAPES_CSS = `
.sheet{fill:var(--sheet)}
.gridl{fill:none;stroke:var(--grid);stroke-width:1}
.frame{fill:none;stroke:var(--line);stroke-width:3}
.frame1{fill:none;stroke:var(--line);stroke-width:1.25}
.ln{fill:none;stroke:var(--line);stroke-width:2}
.thin{fill:none;stroke:var(--line2);stroke-width:1.25}
.redl{fill:none;stroke:var(--red);stroke-width:1.5}
.box{fill:var(--sheet);stroke:var(--line);stroke-width:2}
.ah{fill:var(--line)}
.bubble{fill:var(--sheet);stroke:var(--line);stroke-width:2}
.met.red,.tv2.red{fill:var(--red)}
.pkt{fill:var(--live);opacity:0}
.hit{fill:none;stroke:var(--live);stroke-width:3;opacity:0}
.thr{fill:none;stroke:var(--red);stroke-width:1.2;stroke-dasharray:6 5;opacity:.75}
.alertchip rect{fill:var(--red)}
.livedot{fill:var(--live)}
.penring,.pencross{fill:none;stroke:var(--live);stroke-width:2}
.bar{fill:none;stroke:var(--line2);stroke-width:1.25}
.bar.queued{stroke-dasharray:5 4}
.nexttext{fill:var(--live)}
.paper{fill:var(--sheet);stroke:var(--line);stroke-width:1.5}
.rcl{fill:var(--line2);opacity:.55}
.eyeout{fill:none;stroke:var(--line);stroke-width:2.2}
.iris{fill:none;stroke:var(--line2);stroke-width:2}
.pupil{fill:var(--line2)}
.eard{fill:none;stroke:var(--live);stroke-width:1.3;stroke-dasharray:4 3}
.cookieedge{fill:none;stroke:var(--line);stroke-width:2.2}
.chip{fill:var(--line)}
.liveline{fill:none;stroke:var(--live);stroke-width:1.5}
.yr{fill:none;stroke:var(--grid);stroke-width:1.5}
.faint{opacity:.5}
.gbar{fill:var(--line);opacity:.92}
.gbar.hollow{fill:none;stroke:var(--line);stroke-width:2;opacity:1}
.tipbg{fill:var(--sheet)}
.st{fill:none}
.ink1 .st{stroke:var(--red)}
.ink1 .rim,.ink1 .stname,.ink1 .stsub{fill:var(--red)}
.ink2 .st{stroke:var(--line)}
.ink2 .rim,.ink2 .stname,.ink2 .stsub{fill:var(--line)}
.cx{fill:none;stroke:var(--line2);stroke-width:1.6}
.card{fill:var(--sheet);stroke:var(--line);stroke-width:1.5}
.ico{fill:var(--icon)}
.icol{fill:none;stroke:var(--icon);stroke-width:2;stroke-linejoin:round}
`;

export const MOTION_CSS = `
.plot{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:plot .8s cubic-bezier(.3,.7,.2,1) var(--d,0s) forwards}
.fade{opacity:0;animation:fadein .45s ease-out var(--d,0s) forwards}
.gridfill{opacity:0;animation:fadein 1s ease-out .3s forwards}
.sig{fill-opacity:0;stroke:var(--title);stroke-width:1;stroke-dasharray:240;stroke-dashoffset:240;animation:sig 1.1s ease-out var(--d) forwards}
.cloud{fill:none;stroke:var(--red);stroke-width:1.6;stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:plot 1s ease-out var(--d) forwards,breathe 3s ease-in-out 4s infinite}
@keyframes plot{to{stroke-dashoffset:0}}
@keyframes fadein{to{opacity:1}}
@keyframes sig{70%{stroke-dashoffset:0;fill-opacity:0}100%{stroke-dashoffset:0;fill-opacity:1}}
@keyframes breathe{50%{opacity:.4}}
.a1{animation:a1 3.2s linear 3.4s infinite}
.a2{animation:a2 3.2s linear 3.4s infinite}
.h1{animation:h1 3.2s linear 3.4s infinite}
.h2{animation:h2 3.2s linear 3.4s infinite}
.a1p{animation:a1 3.2s linear .6s infinite}
.a2p{animation:a2 3.2s linear .6s infinite}
.h1p{animation:h1 3.2s linear .6s infinite}
.h2p{animation:h2 3.2s linear .6s infinite}
@keyframes a1{0%{opacity:0;transform:translateX(0)}2%{opacity:1}17%{opacity:1}18.75%,100%{opacity:0;transform:translateX(62px)}}
@keyframes h1{0%,18%{opacity:0}20%,28%{opacity:1}30.5%,100%{opacity:0}}
@keyframes a2{0%,29.7%{opacity:0;transform:translateX(0)}31.5%{opacity:1}46.5%{opacity:1}48.4%,100%{opacity:0;transform:translateX(62px)}}
@keyframes h2{0%,48%{opacity:0}50%,57%{opacity:1}59.5%,100%{opacity:0}}
.f1{animation:fr 3s linear 3.5s infinite}
.f2{animation:fr 3s linear 3.55s infinite}
.f3{animation:fr 3s linear 3.6s infinite}
.hp{animation:hp 3s linear 3.5s infinite}
.b2{animation:b2 3s linear 3.5s infinite}
.hm{animation:hm 3s linear 3.5s infinite}
.tpulse{fill:var(--red);opacity:0;animation:tp 3s linear 3.5s infinite}
.ring{fill:none;stroke:var(--red);stroke-width:2.5;opacity:0;transform-box:fill-box;transform-origin:center;animation:ring 3s ease-out 3.5s infinite}
.rec{fill:var(--red);opacity:0;animation:fadein .3s ease-out 3.2s forwards,rec 1.2s steps(1,end) 3.5s infinite}
@keyframes fr{0%{opacity:0;transform:translateX(0)}1%{opacity:1}7.5%{opacity:1}8.4%,100%{opacity:0;transform:translateX(62px)}}
@keyframes hp{0%,11%{opacity:0}12%,16%{opacity:1}17.5%,100%{opacity:0}}
@keyframes b2{0%,16.67%{opacity:0;transform:translateX(0)}17.5%{opacity:1}26%{opacity:1}26.67%,100%{opacity:0;transform:translateX(62px)}}
@keyframes hm{0%,26.5%{opacity:0}27.5%,31.67%{opacity:1}33.5%,100%{opacity:0}}
@keyframes tp{0%{opacity:1;transform:translateX(0)}31.67%{opacity:1;transform:translateX(736px)}32.5%,100%{opacity:0;transform:translateX(736px)}}
@keyframes ring{0%,31.5%{opacity:0;transform:scale(.5)}33%{opacity:1}46%,100%{opacity:0;transform:scale(2.6)}}
@keyframes rec{50%{opacity:.15}}
.tk{stroke:var(--line2);stroke-width:2.5;stroke-linecap:round;opacity:.35;animation:tk 4.2s ease-in-out infinite}
@keyframes tk{0%,100%{stroke:var(--line2);opacity:.35}8%,55%{stroke:var(--live);opacity:1}70%{stroke:var(--line2);opacity:.35}}
.wave{fill:none;stroke:var(--live);stroke-width:2.2;stroke-linejoin:round;animation:wave 6s linear infinite}
.earlabel{animation:earlabel 6s linear infinite}
.alertchip{opacity:0;animation:alertchip 6s linear infinite}
@keyframes wave{to{transform:translateX(-750px)}}
@keyframes alertchip{0%,76.5%{opacity:0}78%,93%{opacity:1}95%,100%{opacity:0}}
@keyframes earlabel{0%,76.5%{opacity:1}78%,93%{opacity:0}95%,100%{opacity:1}}
.ping{fill:var(--live);transform-box:fill-box;transform-origin:center;animation:ping 1.8s ease-out infinite}
@keyframes ping{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
.ck{fill:none;stroke:var(--live);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:30;stroke-dashoffset:30;animation:ck 6s ease-out infinite}
@keyframes ck{0%{stroke-dashoffset:30;opacity:1}7%{stroke-dashoffset:0}72%{stroke-dashoffset:0;opacity:1}82%,100%{stroke-dashoffset:0;opacity:0}}
.pen{opacity:0;animation:pen 3.9s linear forwards}
@keyframes pen{0%{opacity:1;transform:translate(30px,30px)}14.1%{transform:translate(60px,108px)}17.9%{transform:translate(330px,108px)}21.8%{transform:translate(610px,108px)}25.6%{transform:translate(60px,292px)}28.2%{transform:translate(330px,292px)}30.8%{transform:translate(610px,292px)}43.6%{transform:translate(62px,410px)}50%{transform:translate(798px,410px)}53.8%{transform:translate(840px,48px)}56.4%{transform:translate(840px,236px)}59%{transform:translate(520px,108px)}62.8%{transform:translate(606px,272px)}67.9%{transform:translate(852px,392px);opacity:1}92.3%{transform:translate(905px,398px);opacity:1}100%{transform:translate(1150px,440px);opacity:0}}
.stripes{fill:none;stroke:var(--live);stroke-width:4;opacity:.75;animation:stripes .8s linear infinite}
@keyframes stripes{to{transform:translateX(14px)}}
.nextring{fill:none;stroke:var(--live);stroke-width:2;stroke-dasharray:4 3;transform-box:fill-box;transform-origin:center;animation:spin 6s linear infinite}
.rc{animation:rc 12s cubic-bezier(.3,.7,.2,1) infinite}
.rc2{animation-delay:3s}
.rc3{animation-delay:6s}
.rc4{animation-delay:9s}
@keyframes rc{0%{transform:translateY(0);opacity:1}7%{transform:translateY(-80px)}21%{transform:translateY(-80px);opacity:1}24.5%{transform:translateY(-104px);opacity:0}25%,100%{transform:translateY(0);opacity:0}}
.lm{fill:var(--live);animation:lm 6s linear infinite}
.eye{transform-box:view-box;transform-origin:700px 116px;animation:blink 6s linear infinite}
@keyframes blink{0%,13.5%{transform:scaleY(1)}14.7%{transform:scaleY(.08)}15.9%,37.4%{transform:scaleY(1)}38.7%{transform:scaleY(.08)}39.9%,56.1%{transform:scaleY(1)}57.3%{transform:scaleY(.08)}58.5%,74.7%{transform:scaleY(1)}76.7%,84.7%{transform:scaleY(.08)}86.7%,100%{transform:scaleY(1)}}
@keyframes lm{0%,75%{fill:var(--live)}77%,86%{fill:var(--red)}88%,100%{fill:var(--live)}}
.cookie{transform-box:view-box;transform-origin:560px 108px;animation:spin 24s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.nowline{fill:none;stroke:var(--live);stroke-width:2;stroke-dasharray:6 4;animation:nowpulse 2.4s ease-in-out infinite}
@keyframes nowpulse{50%{opacity:.35}}
.stamp{transform-box:fill-box;transform-origin:center;opacity:0;animation:press 11s cubic-bezier(.2,.9,.25,1.2) infinite}
@keyframes press{0%{opacity:0;transform:scale(1.6)}3.5%{opacity:.95;transform:scale(.95)}5%{transform:scale(1)}84%{opacity:.95;transform:scale(1)}90%,100%{opacity:0;transform:scale(1)}}
.hwc{fill-opacity:0;stroke:var(--title);stroke-width:1.3;stroke-dasharray:420;stroke-dashoffset:420;animation:hwc 10s ease-in-out infinite}
@keyframes hwc{0%{stroke-dashoffset:420;fill-opacity:0;opacity:1}20%{stroke-dashoffset:0;fill-opacity:0}27%{fill-opacity:1}86%{stroke-dashoffset:0;fill-opacity:1;opacity:1}94%,100%{stroke-dashoffset:0;fill-opacity:1;opacity:0}}
.hub{fill:var(--live);animation:nowpulse 2.4s ease-in-out infinite}
.cping{fill:none;stroke:var(--live);stroke-width:2.5;opacity:0;transform-box:fill-box;transform-origin:center;animation:cping 3s ease-out infinite}
.cp1{animation-delay:1s}
.cp2{animation-delay:2s}
@keyframes cping{0%,19%{opacity:0;transform:scale(1)}20%{opacity:.9;transform:scale(1)}45%,100%{opacity:0;transform:scale(1.9)}}
.c0{animation:c0 3s linear infinite}
.c1{animation:c1 3s linear 1s infinite}
.c2{animation:c2 3s linear 2s infinite}
@keyframes c0{0%{opacity:1;transform:translate(0,0)}6.6%{transform:translate(68px,0)}13.2%{transform:translate(68px,-68px)}20%{opacity:1;transform:translate(138px,-68px)}21%,100%{opacity:0;transform:translate(138px,-68px)}}
@keyframes c1{0%{opacity:1;transform:translate(0,0)}20%{opacity:1;transform:translate(138px,0)}21%,100%{opacity:0;transform:translate(138px,0)}}
@keyframes c2{0%{opacity:1;transform:translate(0,0)}6.6%{transform:translate(68px,0)}13.2%{transform:translate(68px,68px)}20%{opacity:1;transform:translate(138px,68px)}21%,100%{opacity:0;transform:translate(138px,68px)}}
`;

// ADR-004 rule 4: every drawing freezes to a meaningful final frame.
export const REDUCED_MOTION_CSS = `@media (prefers-reduced-motion: reduce){
.plot,.cloud{animation:none;stroke-dashoffset:0}
.fade,.gridfill{animation:none;opacity:1}
.sig{animation:none;stroke-dashoffset:0;fill-opacity:1}
.pkt,.hit,.tpulse,.ring,.alertchip,.ping{animation:none;opacity:0}
.rec{animation:none;opacity:1}
.wave,.earlabel{animation:none;opacity:1}
.tk{animation:none;stroke:var(--live);opacity:1}
.ck{animation:none;stroke-dashoffset:0;opacity:1}
.hwc{animation:none;stroke-dashoffset:0;fill-opacity:1;opacity:1}
.cpk,.cping{animation:none;display:none}
.hub{animation:none}
.pen{animation:none;opacity:0}
.stripes,.nextring,.eye,.lm,.cookie,.nowline{animation:none}
.rc{animation:none;opacity:0}
.rc1{animation:none;opacity:1;transform:translateY(-80px)}
.stamp{animation:none;opacity:.95}
}`;

// Typography first: a later single-class rule such as .nexttext must win over .tv, as in the mockup.
export const STYLESHEET = [typographyCss(), SHAPES_CSS.trim(), MOTION_CSS.trim(), REDUCED_MOTION_CSS].join('\n');
