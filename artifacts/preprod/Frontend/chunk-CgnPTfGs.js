import{$ as Kp,Dt as UE,En as gE,F as HE,Fr as wD,Hr as xu,In as iD,Jt as ZE,Lt as Wp,M as Gc,Nn as hh,On as gh,Pr as w,Pt as WD,Sr as th,St as Sh,Un as jv,Wn as kD,X as KD,Xr as l,Yr as k,Yt as Zp,_r as s0,bt as S,cr as ph,dn as cD,dr as qo,en as a0,f as BE,fr as qp,ft as Nr,hr as ru,i as $e,jt as VE,kt as Up,mn as dD,nn as ah,on as bI,or as pE,p as Bc,pr as rD,qn as lD,rr as o0,rt as Lm,s as $u,t as $E,v as CI,vr as sD,w as Di,wr as tw,wt as Su,x as Co}from"./chunk-CEhjPZN3.js";import{T as xi,v as fu,y as jr}from"./chunk-BiG80F1N.js";import{N as si,g as Oi,j,l as Ft$1,o as Fi,t as $e$1,x as Tt$1}from"./chunk-B1oiMcq8.js";import"./chunk-DKV7z_5K.js";import{c,g as u,l as m,o as x,s as E}from"./main-NR2OIDHP.js";import{A as pt$1,D as ji,E as ht,I as zi,L as zr,M as qr,b as Yt$1,f as Oi$1,i as Br,j as q,l as Hr,m as R,o as Do,p as Qr,s as Hn,u as Ke,v as Ur,y as Wr}from"./chunk-CUbiUL64.js";import{n as Pe,t as Be}from"./chunk-DxjGSvFe.js";import{t as p}from"./chunk-hAlH84xB.js";import{n as U,r as q$1,t as K}from"./chunk-CZ98rczu.js";import{n as yt,t as wt$1}from"./chunk-CXP7xnSj.js";import{o as ee,r as Ht$1}from"./chunk-C9JmgckI.js";import{n as Pi,r as X,t as Fi$1}from"./chunk-CIPrZfGm.js";import{t as v}from"./chunk-BdwrPOjK.js";import{t as e}from"./chunk-CX51cPAH2.js";import{t as l$1}from"./chunk-nYOwivAW2.js";import{t as m$1}from"./chunk-BBAGA8Jf2.js";var mt=[`switch`];var pt=[`*`];function ut(s,t){s&1&&(Di(0,`span`,11),$u(),Di(1,`svg`,13),Wp(2,`path`,14),Bc(),Di(3,`svg`,15),Wp(4,`path`,16),Bc()())}var gt=new S(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var he=class{source;checked;constructor(t,e){this.source=t,this.checked=e}};var _e=(()=>{class s{_elementRef=w(Nr);_focusMonitor=w(Tt$1);_changeDetectorRef=w(o0);defaults=w(gt);_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new he(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=j();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new $e;toggleChange=new $e;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){w(xi).load($e$1);let e=w(new Sh(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=i.color||`accent`,this.id=this._uniqueId=w(Ft$1).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e===`keyboard`||e===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new he(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||s)};static ɵcmp=pE({type:s,selectors:[[`mat-slide-toggle`]],viewQuery:function(i,r){if(i&1&&th(mt,5),i&2){let c;cD(c=lD())&&(r._switchElement=c.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(i,r){i&2&&(Zp(`id`,r.id),Up(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),wD(r.color?`mat-`+r.color:``),ah(`mat-mdc-slide-toggle-focused`,r._focused)(`mat-mdc-slide-toggle-checked`,r.checked)(`mat-slide-toggle-full-width`,r.fullWidth)(`_mat-animation-noopable`,r._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,s0],color:`color`,disabled:[2,`disabled`,`disabled`,s0],fullWidth:[2,`fullWidth`,`fullWidth`,s0],disableRipple:[2,`disableRipple`,`disableRipple`,s0],tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:a0(e)],checked:[2,`checked`,`checked`,s0],hideIcon:[2,`hideIcon`,`hideIcon`,s0],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,s0]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[WD([{provide:q,useExisting:Co(()=>s),multi:!0},{provide:R,useExisting:s,multi:!0}]),Lm],ngContentSelectors:pt,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(i,r){if(i&1&&(iD(),Di(0,`div`,1)(1,`button`,2,0),Kp(`click`,function(){return r._handleClick()}),Wp(3,`div`,3)(4,`span`,4),Di(5,`span`,5)(6,`span`,6)(7,`span`,7),Wp(8,`span`,8),Bc(),Di(9,`span`,9),Wp(10,`span`,10),Bc(),VE(11,ut,5,0,`span`,11),Bc()()(),Di(12,`label`,12),Kp(`click`,function(C){return C.stopPropagation()}),sD(13),Bc()()),i&2){let c=dD(2);qp(`labelPosition`,r.labelPosition),jv(),ah(`mdc-switch--selected`,r.checked)(`mdc-switch--unselected`,!r.checked)(`mdc-switch--checked`,r.checked)(`mdc-switch--disabled`,r.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,r.disabledInteractive),qp(`tabIndex`,r.disabled&&!r.disabledInteractive?-1:r.tabIndex)(`disabled`,r.disabled&&!r.disabledInteractive),Up(`id`,r.buttonId)(`name`,r.name)(`aria-label`,r.ariaLabel)(`aria-labelledby`,r._getAriaLabelledBy())(`aria-describedby`,r.ariaDescribedby)(`aria-required`,r.required||null)(`aria-checked`,r.checked)(`aria-disabled`,r.disabled&&r.disabledInteractive?`true`:null),jv(9),qp(`matRippleTrigger`,c)(`matRippleDisabled`,r.disableRipple||r.disabled)(`matRippleCentered`,!0),jv(),HE(r.hideIcon?-1:11),jv(),qp(`for`,r.buttonId),Up(`id`,r._labelId)}},dependencies:[si,m$1],styles:[`.mdc-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})}return s})();var lt=(()=>{class s{static ɵfac=function(i){return new(i||s)};static ɵmod=gE({type:s});static ɵinj=ru({imports:[_e,fu]})}return s})();var st=(s,t)=>t.value;var wt=(s,t)=>t.idConstanciaPlantillaCampo;function Pt(s,t){s&1&&Wp(0,`mat-progress-bar`,2)}function Et(s,t){if(s&1){let e=ZE();Di(0,`form`,3)(1,`div`,5)(2,`div`)(3,`h3`),kD(4,`Datos generales`),Bc(),Di(5,`p`),kD(6,`Se toman al crear el snapshot de cada nueva solicitud.`),Bc()(),Di(7,`button`,15),Kp(`click`,function(){Su(e);return xu(rD().saveConfig())}),Di(8,`mat-icon`),kD(9,`save`),Bc(),kD(10),Bc()(),Di(11,`div`,16)(12,`mat-form-field`,17)(13,`mat-label`),kD(14,`Parroquia / Capellanía`),Bc(),Wp(15,`input`,18),CI(),Bc(),Di(16,`mat-form-field`,17)(17,`mat-label`),kD(18,`Lugar de expedición`),Bc(),Wp(19,`input`,19),CI(),Di(20,`mat-hint`),kD(21,`Ejemplo: PUEBLO NUEVO`),Bc()()(),Di(22,`p`,20),kD(23),KD(24,`date`),Bc()()}if(s&2){let e=t,i=rD();qp(`formGroup`,i.generalForm),jv(7),qp(`disabled`,!i.canEdit()||i.savingConfig()),jv(3),Gc(``,i.savingConfig()?`Guardando...`:`Guardar datos`,` `),jv(5),qp(`readonly`,!i.canEdit()),bI(),jv(4),qp(`readonly`,!i.canEdit()),bI(),jv(4),Gc(`Última actualización: `,e.updatedUtc?tw(24,6,e.updatedUtc,`dd/MM/yyyy HH:mm`,`-0500`):`Sin cambios registrados`)}}function Mt(s,t){s&1&&Wp(0,`mat-progress-bar`,2)}function Nt(s,t){if(s&1&&(Di(0,`mat-option`,14),kD(1),Bc()),s&2){let e=t.$implicit;qp(`value`,e.value),jv(),ph(e.label)}}function kt(s,t){if(s&1&&(Di(0,`mat-form-field`,17)(1,`mat-label`),kD(2,`Dirección IP`),Bc(),Wp(3,`input`,29),CI(),Bc(),Di(4,`mat-form-field`,17)(5,`mat-label`),kD(6,`Puerto`),Bc(),Wp(7,`input`,30),CI(),Bc()),s&2){let e=rD(2);jv(3),qp(`readonly`,!e.canEdit()),bI(),jv(4),qp(`readonly`,!e.canEdit()),bI()}}function It(s,t){if(s&1&&(Di(0,`small`),kD(1),KD(2,`date`),Bc()),s&2){let e=rD();jv(),gh(`Agente: `,e.agente,``,e.equipo?` · Equipo: `+e.equipo:``,``,e.ultimoContactoUtc?` · Último contacto: `+tw(2,3,e.ultimoContactoUtc,`dd/MM/yyyy HH:mm:ss`,`-0500`):``)}}function Ot(s,t){if(s&1&&(Di(0,`div`,31)(1,`mat-icon`),kD(2),Bc(),Di(3,`div`)(4,`strong`),kD(5),Bc(),Di(6,`p`),kD(7),Bc(),VE(8,It,3,7,`small`),Bc()()),s&2){let e=t;ah(`ok`,e.disponible)(`error`,!e.disponible),jv(2),ph(e.disponible?`check_circle`:`error`),jv(3),ph(e.disponible?`Impresora disponible`:`Impresora no disponible`),jv(2),ph(e.mensaje),jv(),HE(e.agente?8:-1)}}function Tt(s,t){if(s&1){let e=ZE();Di(0,`form`,21)(1,`div`,22)(2,`mat-form-field`,17)(3,`mat-label`),kD(4,`Tipo de conexión`),Bc(),Di(5,`mat-select`,23),$E(6,Nt,2,2,`mat-option`,14,st),Bc(),CI(),Bc(),Di(8,`mat-form-field`,24)(9,`mat-label`),kD(10,`Nombre de impresora en Windows`),Bc(),Wp(11,`input`,25),CI(),Di(12,`mat-hint`),kD(13,`Debe coincidir exactamente con el nombre instalado en el equipo del PCR Print Agent.`),Bc()(),VE(14,kt,8,2),Bc(),Di(15,`div`,26)(16,`button`,15),Kp(`click`,function(){Su(e);return xu(rD().savePrinter())}),Di(17,`mat-icon`),kD(18,`save`),Bc(),kD(19),Bc(),Di(20,`button`,9),Kp(`click`,function(){Su(e);return xu(rD().validatePrinter())}),Di(21,`mat-icon`),kD(22,`print`),Bc(),kD(23),Bc()()(),VE(24,Ot,9,8,`div`,27),Di(25,`div`,28)(26,`mat-icon`),kD(27,`info`),Bc(),Di(28,`p`),kD(29,`Si cambias el nombre, tipo de conexión, IP o puerto de la impresora, las tres plantillas pasan automáticamente a `),Di(30,`strong`),kD(31,`Pendiente de calibración`),Bc(),kD(32,`. Sus coordenadas y offsets NO se borran.`),Bc()()}if(s&2){let e,i=rD();qp(`formGroup`,i.printerForm),jv(5),qp(`disabled`,!i.canEdit()),bI(),jv(),UE(i.conexiones),jv(5),qp(`readonly`,!i.canEdit()),bI(),jv(3),HE(i.printerForm.controls.tipoConexion.value===`RED`?14:-1),jv(2),qp(`disabled`,!i.canEdit()||i.savingPrinter()),jv(3),Gc(``,i.savingPrinter()?`Guardando...`:`Guardar impresora`,` `),jv(),qp(`disabled`,i.validatingPrinter()||!t.estaConfigurada),jv(3),Gc(``,i.validatingPrinter()?`Validando...`:`Validar impresora`,` `),jv(),HE((e=i.printerValidation())?24:-1,e)}}function Ft(s,t){if(s&1){let e=ZE();Di(0,`button`,9),Kp(`click`,function(){Su(e);return xu(rD().printTest())}),Di(1,`mat-icon`),kD(2,`print`),Bc(),kD(3),Bc()}if(s&2){let e=rD();qp(`disabled`,e.printingTest()||e.loadingPlantilla()||!e.printer()?.estaConfigurada),jv(3),Gc(``,e.printingTest()?`Imprimiendo...`:`Imprimir hoja de prueba`,` `)}}function At(s,t){if(s&1){let e=ZE();Di(0,`button`,9),Kp(`click`,function(){Su(e);return xu(rD(2).openCalibration())}),Di(1,`mat-icon`),kD(2,`tune`),Bc(),kD(3,`Editar calibración `),Bc()}if(s&2){let e=rD(2);qp(`disabled`,!e.canEdit()||e.changingCalibration())}}function Dt(s,t){if(s&1){let e=ZE();Di(0,`button`,15),Kp(`click`,function(){Su(e);return xu(rD(2).markCalibrated())}),Di(1,`mat-icon`),kD(2,`verified`),Bc(),kD(3,`Marcar como calibrada `),Bc(),Di(4,`button`,9),Kp(`click`,function(){Su(e);return xu(rD(2).savePlantilla())}),Di(5,`mat-icon`),kD(6,`save`),Bc(),kD(7),Bc()}if(s&2){let e=rD(2);qp(`disabled`,!e.canEdit()||e.changingCalibration()||e.savingPlantilla()),jv(4),qp(`disabled`,!e.canEditCalibration()||e.savingPlantilla()||e.loadingPlantilla()),jv(3),Gc(``,e.savingPlantilla()?`Guardando...`:`Guardar parámetros`,` `)}}function Vt(s,t){s&1&&VE(0,At,4,1,`button`,10)(1,Dt,8,3),s&2&&HE(t.estaCalibrada?0:1)}function zt(s,t){s&1&&(Di(0,`div`,11)(1,`mat-icon`),kD(2,`print`),Bc(),Di(3,`span`),kD(4),Bc()()),s&2&&(jv(4),ph(t))}function Rt(s,t){if(s&1&&(Di(0,`mat-option`,14),kD(1),Bc()),s&2){let e=t.$implicit;qp(`value`,e.value),jv(),ph(e.label)}}function qt(s,t){s&1&&Wp(0,`mat-progress-bar`,2)}function Lt(s,t){if(s&1&&(Di(0,`option`,14),kD(1),Bc()),s&2){let e=t.$implicit;qp(`value`,e),jv(),ph(e)}}function jt(s,t){if(s&1){let e=ZE();Di(0,`tr`)(1,`td`)(2,`input`,43),Kp(`change`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldActive(c.idConstanciaPlantillaCampo,r))}),Bc()(),Di(3,`td`,44)(4,`strong`),kD(5),Bc(),Di(6,`small`),kD(7),Bc()(),Di(8,`td`)(9,`input`,45),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`xmm`,r))}),Bc()(),Di(10,`td`)(11,`input`,45),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`ymm`,r))}),Bc()(),Di(12,`td`)(13,`input`,45),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`anchoMm`,r))}),Bc()(),Di(14,`td`)(15,`input`,45),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`altoMm`,r))}),Bc()(),Di(16,`td`)(17,`input`,45),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`tamanoFuentePt`,r))}),Bc()(),Di(18,`td`)(19,`select`,46),Kp(`change`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldAlignment(c.idConstanciaPlantillaCampo,r))}),$E(20,Lt,2,2,`option`,14,BE),Bc()(),Di(22,`td`)(23,`input`,47),Kp(`input`,function(r){let c=Su(e).$implicit;return xu(rD(2).setFieldNumber(c.idConstanciaPlantillaCampo,`maxLineas`,r))}),Bc()()()}if(s&2){let e=t.$implicit,i=rD(),r=rD();ah(`locked-row`,i.estaCalibrada),jv(2),qp(`checked`,e.isActive)(`disabled`,!r.canEditCalibration()),jv(3),ph(e.etiqueta),jv(2),ph(e.codigoCampo),jv(2),qp(`value`,e.xmm)(`disabled`,!r.canEditCalibration()),jv(2),qp(`value`,e.ymm)(`disabled`,!r.canEditCalibration()),jv(2),qp(`value`,e.anchoMm)(`disabled`,!r.canEditCalibration()),jv(2),qp(`value`,e.altoMm)(`disabled`,!r.canEditCalibration()),jv(2),qp(`value`,e.tamanoFuentePt)(`disabled`,!r.canEditCalibration()),jv(2),qp(`value`,e.alineacion)(`disabled`,!r.canEditCalibration()),jv(),UE(r.alineaciones),jv(3),qp(`value`,e.maxLineas)(`disabled`,!r.canEditCalibration())}}function Bt(s,t){if(s&1&&(Di(0,`div`,32)(1,`mat-icon`),kD(2),Bc(),Di(3,`div`)(4,`strong`),kD(5),Bc(),Di(6,`p`),kD(7),Bc()()(),Di(8,`form`,33)(9,`div`,34)(10,`mat-form-field`,17)(11,`mat-label`),kD(12,`Ancho papel (mm)`),Bc(),Wp(13,`input`,35),CI(),Bc(),Di(14,`mat-form-field`,17)(15,`mat-label`),kD(16,`Alto papel (mm)`),Bc(),Wp(17,`input`,36),CI(),Bc(),Di(18,`mat-form-field`,17)(19,`mat-label`),kD(20,`Offset global X (mm)`),Bc(),Wp(21,`input`,37),CI(),Di(22,`mat-hint`),kD(23,`Mueve todos los campos horizontalmente.`),Bc()(),Di(24,`mat-form-field`,17)(25,`mat-label`),kD(26,`Offset global Y (mm)`),Bc(),Wp(27,`input`,38),CI(),Di(28,`mat-hint`),kD(29,`Mueve todos los campos verticalmente.`),Bc()()()(),Di(30,`div`,39)(31,`mat-icon`),kD(32,`straighten`),Bc(),Di(33,`div`)(34,`strong`),kD(35,`Calibración recomendada`),Bc(),Di(36,`p`),kD(37,`Primero corrige desplazamientos generales con Offset global X/Y. Modifica X/Y de un campo únicamente si ese dato individual no coincide con su línea.`),Bc()()(),Di(38,`div`,40)(39,`table`,41)(40,`thead`)(41,`tr`)(42,`th`),kD(43,`Usar`),Bc(),Di(44,`th`),kD(45,`Campo`),Bc(),Di(46,`th`),kD(47,`X`),Bc(),Di(48,`th`),kD(49,`Y`),Bc(),Di(50,`th`),kD(51,`Ancho`),Bc(),Di(52,`th`),kD(53,`Alto`),Bc(),Di(54,`th`),kD(55,`Fuente`),Bc(),Di(56,`th`),kD(57,`Alineación`),Bc(),Di(58,`th`),kD(59,`Líneas`),Bc()()(),Di(60,`tbody`),$E(61,jt,24,20,`tr`,42,wt),Bc()()(),Di(63,`p`,20),kD(64),KD(65,`date`),Bc()),s&2){let e=t,i=rD();ah(`calibrated`,e.estaCalibrada)(`pending`,!e.estaCalibrada),jv(2),ph(e.estaCalibrada?`lock`:`lock_open`),jv(3),ph(e.estaCalibrada?`CALIBRADA · parámetros bloqueados`:`PENDIENTE DE CALIBRACIÓN · parámetros editables`),jv(2),ph(e.estaCalibrada?`Para modificar papel, offsets o campos usa “Editar calibración”.`:`Realiza las pruebas físicas y, cuando todo coincida, usa “Marcar como calibrada”.`),jv(),qp(`formGroup`,i.plantillaForm),jv(5),bI(),jv(4),bI(),jv(4),bI(),jv(6),bI(),jv(34),UE(i.campos()),jv(3),hh(`Estado: `,e.estaCalibrada?`Calibrada y bloqueada`:`Pendiente de calibración`,` · Última actualización: `,e.updatedUtc?tw(65,10,e.updatedUtc,`dd/MM/yyyy HH:mm`,`-0500`):`Sin cambios registrados`)}}var be=class s{fb=w(Wr);api=w(e);feedback=w(p);authStore=w(x);dialog=w(ee);loadingConfig=qo(!1);savingConfig=qo(!1);loadingPrinter=qo(!1);savingPrinter=qo(!1);validatingPrinter=qo(!1);printerValidation=qo(null);loadingPlantilla=qo(!1);savingPlantilla=qo(!1);changingCalibration=qo(!1);generatingTest=qo(!1);printingTest=qo(!1);testPrintStatus=qo(null);fieldsDirty=qo(!1);config=qo(null);printer=qo(null);plantilla=qo(null);campos=qo([]);selectedTipo=qo(`BAUTISMO`);canEdit=()=>this.authStore.hasPermission(E.CONFIGURATION_EDIT);canEditCalibration=()=>this.canEdit()&&this.plantilla()?.estaCalibrada===!1;tipos=[{value:`BAUTISMO`,label:`Bautismo`},{value:`CONFIRMACION`,label:`Confirmación`},{value:`MATRIMONIO`,label:`Matrimonio`}];conexiones=[{value:`USB`,label:`USB / instalada localmente`},{value:`RED`,label:`Red Ethernet`},{value:`COMPARTIDA`,label:`Impresora compartida de Windows`}];alineaciones=[`LEFT`,`CENTER`,`RIGHT`];generalForm=this.fb.nonNullable.group({nombreParroquia:[``,[Ke.required,Ke.maxLength(250)]],lugarExpedicion:[``,[Ke.required,Ke.maxLength(150)]]});printerForm=this.fb.nonNullable.group({tipoConexion:this.fb.nonNullable.control(`USB`),nombreImpresoraWindows:[``,[Ke.required,Ke.maxLength(150)]],direccionIp:[``,Ke.maxLength(45)],puerto:[9100,[Ke.min(1),Ke.max(65535)]]});plantillaForm=this.fb.nonNullable.group({anchoPapelMm:[210,[Ke.required,Ke.min(1),Ke.max(1e3)]],altoPapelMm:[297,[Ke.required,Ke.min(1),Ke.max(1e3)]],offsetGlobalXmm:[0,[Ke.required,Ke.min(-100),Ke.max(100)]],offsetGlobalYmm:[0,[Ke.required,Ke.min(-100),Ke.max(100)]]});ngOnInit(){this.loadConfig(),this.loadPrinter(),this.loadPlantilla()}tipoChanged(t){this.selectedTipo.set(t),this.loadPlantilla()}saveConfig(){if(!this.canEdit()||this.savingConfig()||(this.generalForm.markAllAsTouched(),this.generalForm.invalid))return;let t=this.config();if(!t)return;let e=this.generalForm.getRawValue();this.savingConfig.set(!0),this.api.updateConfiguracion({nombreParroquia:e.nombreParroquia.trim(),lugarExpedicion:e.lugarExpedicion.trim(),rowVersion:t.rowVersion}).subscribe({next:i=>{this.savingConfig.set(!1),this.applyConfig(i),this.feedback.success(`Parámetros generales de constancias actualizados.`)},error:i=>{this.savingConfig.set(!1),this.feedback.error(K(i,`No se pudieron actualizar los parámetros generales de constancias.`))}})}savePrinter(){if(!this.canEdit()||this.savingPrinter()||(this.printerForm.markAllAsTouched(),this.printerForm.invalid))return;let t=this.printer();if(!t)return;let e=this.printerForm.getRawValue(),i=e.tipoConexion===`RED`;if(i&&(!e.direccionIp.trim()||!e.puerto)){this.feedback.warning(`Para una impresora de red debes indicar dirección IP y puerto.`);return}this.savingPrinter.set(!0),this.api.updateImpresora({tipoConexion:e.tipoConexion,nombreImpresoraWindows:e.nombreImpresoraWindows.trim(),direccionIp:i?e.direccionIp.trim():null,puerto:i?e.puerto:null,rowVersion:t.rowVersion}).subscribe({next:r=>{this.savingPrinter.set(!1),this.applyPrinter(r.configuracion),this.printerValidation.set(null),this.loadPlantilla(),r.plantillasDescalibradas>0?this.feedback.warning(`${r.mensaje} Se desmarcaron ${r.plantillasDescalibradas} plantilla(s) para volver a verificar su calibraci\xF3n.`):this.feedback.success(r.mensaje)},error:r=>{this.savingPrinter.set(!1),this.feedback.error(K(r,`No se pudo actualizar la impresora de constancias.`))}})}validatePrinter(){this.validatingPrinter()||(this.validatingPrinter.set(!0),this.api.validarImpresora().subscribe({next:t=>{this.validatingPrinter.set(!1),this.printerValidation.set(t),t.disponible?this.feedback.success(t.mensaje):this.feedback.warning(t.mensaje)},error:t=>{this.validatingPrinter.set(!1),this.printerValidation.set(null),this.feedback.error(K(t,`No se pudo validar la impresora de constancias.`))}}))}savePlantilla(){if(!this.canEditCalibration()||this.savingPlantilla()||(this.plantillaForm.markAllAsTouched(),this.plantillaForm.invalid))return;let t=this.plantilla();if(!t)return;let e=this.plantillaForm.getRawValue();this.savingPlantilla.set(!0),this.api.updatePlantilla(this.selectedTipo(),l(k({},e),{estaCalibrada:!1,campos:this.campos().map(i=>({codigoCampo:i.codigoCampo,xmm:i.xmm,ymm:i.ymm,anchoMm:i.anchoMm,altoMm:i.altoMm,tamanoFuentePt:i.tamanoFuentePt,alineacion:i.alineacion,maxLineas:i.maxLineas,isActive:i.isActive})),rowVersion:t.rowVersion})).subscribe({next:i=>{this.savingPlantilla.set(!1),this.applyPlantilla(i),this.feedback.success(`Plantilla guardada. Continúa pendiente de marcar como calibrada.`)},error:i=>{this.savingPlantilla.set(!1),this.feedback.error(K(i,`No se pudo actualizar la plantilla de constancia.`))}})}openCalibration(){let t=this.plantilla();!this.canEdit()||!t||!t.estaCalibrada||this.changingCalibration()||this.confirm(`Editar calibración`,`La plantilla quedará temporalmente NO CALIBRADA y se bloqueará la impresión oficial hasta que vuelvas a marcarla como calibrada.`,`Editar calibración`,`tune`).subscribe(e=>{e&&(this.changingCalibration.set(!0),this.api.abrirCalibracion(this.selectedTipo(),{rowVersion:t.rowVersion}).subscribe({next:i=>{this.changingCalibration.set(!1),this.applyPlantilla(i),this.feedback.warning(`Calibración abierta. Ajusta los parámetros, imprime pruebas y vuelve a marcarla como calibrada.`)},error:i=>{this.changingCalibration.set(!1),this.feedback.error(K(i,`No se pudo abrir la calibración.`))}}))})}markCalibrated(){if(this.hasUnsavedCalibrationChanges()){this.feedback.warning(`Guarda los parámetros de calibración antes de marcar la plantilla como calibrada.`);return}let t=this.plantilla();!this.canEdit()||!t||t.estaCalibrada||this.changingCalibration()||this.confirm(`Marcar plantilla como calibrada`,`Confirma únicamente si ya realizaste una prueba física y todos los datos coinciden con el formato oficial. Después los parámetros quedarán bloqueados.`,`Marcar calibrada`,`verified`).subscribe(e=>{e&&(this.changingCalibration.set(!0),this.api.marcarCalibrada(this.selectedTipo(),{rowVersion:t.rowVersion}).subscribe({next:i=>{this.changingCalibration.set(!1),this.applyPlantilla(i),this.feedback.success(`Plantilla calibrada y bloqueada para edición.`)},error:i=>{this.changingCalibration.set(!1),this.feedback.error(K(i,`No se pudo marcar la plantilla como calibrada.`))}}))})}viewTest(){if(this.hasUnsavedCalibrationChanges()){this.feedback.warning(`Guarda los parámetros antes de generar la hoja de prueba para que el PDF use los valores actuales.`);return}if(this.generatingTest())return;let t=window.open(``,`_blank`);this.generatingTest.set(!0),this.api.getPruebaPdf(this.selectedTipo()).subscribe({next:e=>{this.generatingTest.set(!1),this.openBlob(e,t)},error:e=>{this.generatingTest.set(!1),t?.close(),this.feedback.error(K(e,`No se pudo generar la hoja de prueba.`))}})}printTest(){if(this.canEdit()){if(this.hasUnsavedCalibrationChanges()){this.feedback.warning(`Guarda los parámetros antes de imprimir la hoja de prueba para que la impresora use la calibración actual.`);return}this.printingTest()||(this.printingTest.set(!0),this.testPrintStatus.set(`Enviando hoja de prueba a la impresora configurada...`),this.api.imprimirPrueba(this.selectedTipo()).subscribe({next:t=>{this.testPrintStatus.set(`Trabajo #${t.idTrabajo} \xB7 ${t.estado} \xB7 ${t.impresora}`),this.feedback.success(`Hoja de prueba enviada a ${t.impresora}.`),this.waitForPrintJob(t.idTrabajo,e=>{this.printingTest.set(!1),this.testPrintStatus.set(`Trabajo #${e.idTrabajo} \xB7 ${e.estado} \xB7 ${e.impresora}`),e.estado===`COMPLETADO`?this.feedback.success(`Hoja de prueba enviada correctamente al spooler de Windows.`):this.feedback.error(e.ultimoDetalle||`La impresión de prueba terminó con error.`)})},error:t=>{this.printingTest.set(!1),this.testPrintStatus.set(null),this.feedback.error(K(t,`No se pudo imprimir la hoja de prueba.`))}}))}}setFieldNumber(t,e,i){if(!this.canEditCalibration())return;let r=Number(i.target.value);Number.isFinite(r)&&(this.campos.update(c=>c.map(C=>C.idConstanciaPlantillaCampo===t?l(k({},C),{[e]:e===`maxLineas`?Math.trunc(r):r}):C)),this.fieldsDirty.set(!0))}setFieldAlignment(t,e){if(!this.canEditCalibration())return;let i=e.target.value;this.campos.update(r=>r.map(c=>c.idConstanciaPlantillaCampo===t?l(k({},c),{alineacion:i}):c)),this.fieldsDirty.set(!0)}setFieldActive(t,e){if(!this.canEditCalibration())return;let i=e.target.checked;this.campos.update(r=>r.map(c=>c.idConstanciaPlantillaCampo===t?l(k({},c),{isActive:i}):c)),this.fieldsDirty.set(!0)}loadConfig(){this.loadingConfig.set(!0),this.api.getConfiguracion().subscribe({next:t=>{this.loadingConfig.set(!1),this.applyConfig(t)},error:t=>{this.loadingConfig.set(!1),this.feedback.error(K(t,`No se pudo cargar la configuración de constancias.`))}})}loadPrinter(){this.loadingPrinter.set(!0),this.api.getImpresora().subscribe({next:t=>{this.loadingPrinter.set(!1),this.applyPrinter(t)},error:t=>{this.loadingPrinter.set(!1),this.feedback.error(K(t,`No se pudo cargar la impresora de constancias.`))}})}loadPlantilla(){this.loadingPlantilla.set(!0),this.api.getPlantilla(this.selectedTipo()).subscribe({next:t=>{this.loadingPlantilla.set(!1),this.applyPlantilla(t)},error:t=>{this.loadingPlantilla.set(!1),this.feedback.error(K(t,`No se pudo cargar la plantilla de constancia.`))}})}applyConfig(t){this.config.set(t),this.generalForm.reset({nombreParroquia:t.nombreParroquia,lugarExpedicion:t.lugarExpedicion})}applyPrinter(t){this.printer.set(t),this.printerForm.reset({tipoConexion:t.tipoConexion,nombreImpresoraWindows:t.nombreImpresoraWindows??``,direccionIp:t.direccionIp??``,puerto:t.puerto??9100})}applyPlantilla(t){this.plantilla.set(t),this.campos.set(t.campos.map(e=>k({},e))),this.plantillaForm.reset({anchoPapelMm:t.anchoPapelMm,altoPapelMm:t.altoPapelMm,offsetGlobalXmm:t.offsetGlobalXmm,offsetGlobalYmm:t.offsetGlobalYmm}),this.fieldsDirty.set(!1),this.plantillaForm.markAsPristine(),t.estaCalibrada?this.plantillaForm.disable({emitEvent:!1}):this.canEdit()?this.plantillaForm.enable({emitEvent:!1}):this.plantillaForm.disable({emitEvent:!1})}confirm(t,e,i,r){return this.dialog.open(v,{width:`min(520px, calc(100vw - 2rem))`,data:{title:t,message:e,cancelText:`Cancelar`,confirmText:i,icon:r}}).afterClosed()}hasUnsavedCalibrationChanges(){return this.plantillaForm.dirty||this.fieldsDirty()}waitForPrintJob(t,e,i=0){this.api.getTrabajoEstado(t).subscribe({next:r=>{if(this.testPrintStatus.set(`Trabajo #${r.idTrabajo} \xB7 ${r.estado} \xB7 intento ${r.intentos}/${r.maxIntentos}`),r.estado===`COMPLETADO`||r.estado===`ERROR`){e(r);return}if(i>=90){this.printingTest.set(!1),this.feedback.warning(`La impresión sigue pendiente. Puedes continuar trabajando y revisar el PCR Print Agent.`);return}window.setTimeout(()=>this.waitForPrintJob(t,e,i+1),1e3)},error:r=>{this.printingTest.set(!1),this.feedback.error(K(r,`No se pudo consultar el estado de impresión.`))}})}openBlob(t,e){let i=URL.createObjectURL(t);e?e.location.href=i:window.open(i,`_blank`),window.setTimeout(()=>URL.revokeObjectURL(i),6e4)}static ɵfac=function(e){return new(e||s)};static ɵcmp=pE({type:s,selectors:[[`pcr-constancia-print-settings`]],decls:45,vars:12,consts:[[1,`constancia-settings`],[1,`section-title`],[`mode`,`indeterminate`],[1,`settings-card`,3,`formGroup`],[1,`settings-card`,`printer-card`],[1,`card-heading`],[1,`mode-badge`],[1,`settings-card`,`template-card`],[1,`heading-actions`],[`mat-stroked-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-stroked-button`,``,`type`,`button`,3,`disabled`],[1,`print-job-status`],[`appearance`,`outline`,1,`type-select`],[3,`selectionChange`,`value`],[3,`value`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`],[1,`general-grid`],[`appearance`,`outline`],[`matInput`,``,`formControlName`,`nombreParroquia`,3,`readonly`],[`matInput`,``,`formControlName`,`lugarExpedicion`,3,`readonly`],[1,`updated`],[1,`printer-form`,3,`formGroup`],[1,`printer-grid`],[`formControlName`,`tipoConexion`,3,`disabled`],[`appearance`,`outline`,1,`printer-name`],[`matInput`,``,`formControlName`,`nombreImpresoraWindows`,3,`readonly`],[1,`printer-actions`],[1,`printer-validation`,3,`ok`,`error`],[1,`printer-warning`],[`matInput`,``,`formControlName`,`direccionIp`,3,`readonly`],[`matInput`,``,`type`,`number`,`formControlName`,`puerto`,3,`readonly`],[1,`printer-validation`],[1,`calibration-status`],[1,`template-form`,3,`formGroup`],[1,`paper-grid`],[`matInput`,``,`type`,`number`,`step`,`0.1`,`formControlName`,`anchoPapelMm`],[`matInput`,``,`type`,`number`,`step`,`0.1`,`formControlName`,`altoPapelMm`],[`matInput`,``,`type`,`number`,`step`,`0.1`,`formControlName`,`offsetGlobalXmm`],[`matInput`,``,`type`,`number`,`step`,`0.1`,`formControlName`,`offsetGlobalYmm`],[1,`calibration-note`],[1,`field-table-wrap`],[1,`field-table`],[3,`locked-row`],[`type`,`checkbox`,1,`active-check`,3,`change`,`checked`,`disabled`],[1,`field-name`],[`type`,`number`,`step`,`0.1`,3,`input`,`value`,`disabled`],[3,`change`,`value`,`disabled`],[`type`,`number`,`min`,`1`,`max`,`10`,`step`,`1`,3,`input`,`value`,`disabled`]],template:function(e,i){if(e&1&&(Di(0,`section`,0)(1,`div`,1)(2,`div`)(3,`h2`),kD(4,`Impresión de constancias`),Bc(),Di(5,`p`),kD(6,`Configura la impresora dedicada y calibra los datos que se imprimirán sobre los formatos oficiales del Obispado.`),Bc()()(),VE(7,Pt,1,0,`mat-progress-bar`,2),VE(8,Et,25,10,`form`,3),Di(9,`div`,4)(10,`div`,5)(11,`div`)(12,`h3`),kD(13,`Impresora de constancias`),Bc(),Di(14,`p`),kD(15,`Es independiente de la ticketera. El modo es siempre MANUAL para que Secretaría revise los datos antes de imprimir.`),Bc()(),Di(16,`span`,6)(17,`mat-icon`),kD(18,`visibility`),Bc(),kD(19,`MANUAL`),Bc()(),VE(20,Mt,1,0,`mat-progress-bar`,2),VE(21,Tt,33,9),Bc(),Di(22,`section`,7)(23,`div`,5)(24,`div`)(25,`h3`),kD(26,`Calibración de plantillas`),Bc(),Di(27,`p`),kD(28,`Las coordenadas quedan bloqueadas después de confirmar una calibración física.`),Bc()(),Di(29,`div`,8)(30,`button`,9),Kp(`click`,function(){return i.viewTest()}),Di(31,`mat-icon`),kD(32,`picture_as_pdf`),Bc(),kD(33),Bc(),VE(34,Ft,4,2,`button`,10),VE(35,Vt,2,1),Bc()(),VE(36,zt,5,1,`div`,11),Di(37,`mat-form-field`,12)(38,`mat-label`),kD(39,`Tipo de constancia`),Bc(),Di(40,`mat-select`,13),Kp(`selectionChange`,function(c){return i.tipoChanged(c.value)}),$E(41,Rt,2,2,`mat-option`,14,st),Bc()(),VE(43,qt,1,0,`mat-progress-bar`,2),VE(44,Bt,66,14),Bc()()),e&2){let r,c,C,ve,Ce;jv(7),HE(i.loadingConfig()?7:-1),jv(),HE((r=i.config())?8:-1,r),jv(12),HE(i.loadingPrinter()?20:-1),jv(),HE((c=i.printer())?21:-1,c),jv(9),qp(`disabled`,i.generatingTest()||i.loadingPlantilla()),jv(3),Gc(``,i.generatingTest()?`Generando...`:`Ver hoja de prueba`,` `),jv(),HE(i.canEdit()?34:-1),jv(),HE((C=i.plantilla())?35:-1,C),jv(),HE((ve=i.testPrintStatus())?36:-1,ve),jv(4),qp(`value`,i.selectedTipo()),jv(),UE(i.tipos),jv(2),HE(i.loadingPlantilla()?43:-1),jv(),HE((Ce=i.plantilla())?44:-1,Ce)}},dependencies:[Qr,Hr,Ur,qr,Yt$1,Oi$1,Br,zr,zi,ji,Fi,Oi,Ht$1,Do,Hn,ht,pt$1,yt,wt$1,Be,Pe,q$1,U,Pi,Fi$1,X,jr],styles:[`.constancia-settings[_ngcontent-%COMP%]{display:grid;gap:.9rem}.section-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .card-heading[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 0 .2rem}.section-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .card-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;opacity:.7}.settings-card[_ngcontent-%COMP%]{padding:1.2rem;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:1rem;background:var(--%NS%mat-sys-surface);display:grid;gap:1rem}.card-heading[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}.heading-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:flex-end}.general-grid[_ngcontent-%COMP%], .paper-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem 1rem}.type-select[_ngcontent-%COMP%]{width:min(100%,340px)}.template-form[_ngcontent-%COMP%]{display:grid;gap:.8rem}.calibration-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:1rem;align-items:center}.calibration-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .updated[_ngcontent-%COMP%]{font-size:.78rem;opacity:.68}.calibration-note[_ngcontent-%COMP%]{display:flex;gap:.75rem;padding:.9rem;border-radius:.8rem;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.calibration-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:.15rem 0 0;font-size:.82rem}.field-table-wrap[_ngcontent-%COMP%]{overflow-x:auto;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:.8rem}.field-table[_ngcontent-%COMP%]{width:100%;min-width:980px;border-collapse:collapse}.field-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .field-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:.55rem .45rem;border-bottom:1px solid var(--%NS%mat-sys-outline-variant);text-align:left;vertical-align:middle}.field-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{font-size:.76rem;background:var(--%NS%mat-sys-surface-container-low)}.field-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%]{border-bottom:0}.field-table[_ngcontent-%COMP%]   input[type=number][_ngcontent-%COMP%], .field-table[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:78px;box-sizing:border-box;padding:.42rem .35rem;border:1px solid var(--%NS%mat-sys-outline);border-radius:.35rem;background:var(--%NS%mat-sys-surface);color:inherit}.field-table[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]{width:102px}.active-check[_ngcontent-%COMP%]{width:1rem;height:1rem}.field-name[_ngcontent-%COMP%]{min-width:190px}.field-name[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .field-name[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{display:block}.field-name[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{margin-top:.15rem;opacity:.6;font-size:.68rem}.updated[_ngcontent-%COMP%]{margin:0}@media(max-width:760px){.card-heading[_ngcontent-%COMP%], .calibration-row[_ngcontent-%COMP%]{flex-direction:column;align-items:stretch}.heading-actions[_ngcontent-%COMP%]{justify-content:stretch}.heading-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:1 1 100%}.general-grid[_ngcontent-%COMP%], .paper-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}.printer-card[_ngcontent-%COMP%]{margin-top:1rem}.printer-form[_ngcontent-%COMP%]{display:grid;gap:1rem}.printer-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.printer-name[_ngcontent-%COMP%]{grid-column:span 1}.printer-actions[_ngcontent-%COMP%], .heading-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}.mode-badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .7rem;border-radius:999px;background:var(--%NS%mat-sys-surface-container-high);font-weight:700;font-size:.8rem}.mode-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:18px;height:18px;font-size:18px}.printer-validation[_ngcontent-%COMP%], .printer-warning[_ngcontent-%COMP%], .calibration-status[_ngcontent-%COMP%]{display:flex;gap:.8rem;align-items:flex-start;border-radius:12px;padding:.9rem 1rem;margin-top:1rem}.printer-validation[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .printer-warning[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .calibration-status[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:.2rem 0 0}.printer-validation[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{display:block;margin-top:.35rem;opacity:.8}.printer-validation.ok[_ngcontent-%COMP%], .calibration-status.calibrated[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%mat-sys-primary) 10%,transparent)}.printer-validation.error[_ngcontent-%COMP%], .calibration-status.pending[_ngcontent-%COMP%]{background:color-mix(in srgb,var(--%NS%mat-sys-error) 10%,transparent)}.printer-warning[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container)}.calibration-status[_ngcontent-%COMP%]{margin-bottom:1rem}.calibration-status.calibrated[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.calibration-status.pending[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}.locked-row[_ngcontent-%COMP%]{opacity:.72}@media(max-width:800px){.printer-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.printer-name[_ngcontent-%COMP%]{grid-column:auto}.printer-actions[_ngcontent-%COMP%], .heading-actions[_ngcontent-%COMP%]{width:100%}}.print-job-status[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.55rem;margin:.75rem 0;padding:.7rem .85rem;border-radius:10px;background:var(--%NS%mat-sys-surface-container);font-size:.85rem}.print-job-status[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}`]})};var dt=(s,t)=>t.value;function Gt(s,t){s&1&&Wp(0,`mat-progress-bar`,7)}function Ut(s,t){if(s&1&&(Di(0,`div`,13)(1,`article`)(2,`span`),kD(3,`Pendientes`),Bc(),Di(4,`strong`),kD(5),Bc()(),Di(6,`article`)(7,`span`),kD(8,`Vencidos`),Bc(),Di(9,`strong`),kD(10),Bc()(),Di(11,`article`)(12,`span`),kD(13,`Procesando`),Bc(),Di(14,`strong`),kD(15),Bc()(),Di(16,`article`)(17,`span`),kD(18,`Errores / cancelados`),Bc(),Di(19,`strong`),kD(20),Bc()()()),s&2){let e=t;jv(5),ph(e.pendientes),jv(5),ph(e.pendientesVencidos),jv(5),ph(e.procesando),jv(5),ph(e.errores)}}function $t(s,t){if(s&1){let e=ZE();Di(0,`form`,8)(1,`div`,11)(2,`div`)(3,`strong`),kD(4),Bc(),Di(5,`p`),kD(6),Bc()(),Di(7,`mat-slide-toggle`,12),kD(8,` Permitir procesamiento de cola `),Bc(),CI(),Bc(),VE(9,Ut,21,4,`div`,13),Di(10,`div`,14)(11,`mat-form-field`,15)(12,`mat-label`),kD(13,`Caducidad automática (min)`),Bc(),Wp(14,`input`,16),CI(),Di(15,`mat-hint`),kD(16,`Tickets y trabajos AUTOMÁTICOS viejos pasan a ERROR y no se imprimen.`),Bc()(),Di(17,`mat-form-field`,15)(18,`mat-label`),kD(19,`Caducidad manual (min)`),Bc(),Wp(20,`input`,17),CI(),Di(21,`mat-hint`),kD(22,`Protege impresiones manuales olvidadas cuando el agente estuvo apagado.`),Bc()()(),Di(23,`div`,18)(24,`div`)(25,`strong`),kD(26,`Trabajos pendientes acumulados`),Bc(),Di(27,`p`),kD(28,`Si hiciste ventas o pruebas con el agente apagado, cancela los pendientes antes de reanudar la cola. No se eliminan: quedan como ERROR con su motivo.`),Bc()(),Di(29,`button`,19),Kp(`click`,function(){Su(e);return xu(rD(2).cancelarPendientes())}),Di(30,`mat-icon`),kD(31,`delete_sweep`),Bc(),kD(32),Bc()(),Di(33,`div`,20)(34,`mat-icon`),kD(35,`warning`),Bc(),Di(36,`div`)(37,`strong`),kD(38,`Doble protección`),Bc(),Di(39,`p`),kD(40,`Pausar es el control manual. La caducidad es el control automático. Aunque olvides pausar, un trabajo vencido ya no será tomado por el agente.`),Bc()()(),Di(41,`p`,21),kD(42),Bc()()}if(s&2){let e,i=t,r=rD(2);qp(`formGroup`,r.colaForm),jv(),ah(`queue-state--paused`,!r.colaForm.controls.colaHabilitada.value),jv(3),ph(r.colaForm.controls.colaHabilitada.value?`COLA HABILITADA`:`COLA PAUSADA`),jv(2),Gc(` `,r.colaForm.controls.colaHabilitada.value?`El Print Agent puede tomar nuevos trabajos vigentes.`:`El Print Agent no recibirá nuevos trabajos. Un trabajo que ya esté PROCESANDO puede terminar.`,` `),jv(),qp(`disabled`,!r.canEditQueue()),bI(),jv(2),HE((e=r.resumenCola())?9:-1,e),jv(5),qp(`readonly`,!r.canEditQueue()),bI(),jv(6),qp(`readonly`,!r.canEditQueue()),bI(),jv(9),qp(`disabled`,!r.canCancelQueue()||r.cancellingCola()||(r.resumenCola()?.pendientes??0)===0),jv(3),Gc(``,r.cancellingCola()?`Cancelando...`:`Cancelar pendientes`,` `),jv(10),hh(`Última actualización: `,i.updatedUtc||`—`,` · `,i.updatedBy||`Sistema`)}}function Ht(s,t){if(s&1){let e=ZE();Di(0,`section`,3)(1,`div`,5)(2,`div`)(3,`h2`),kD(4,`Seguridad de la cola de impresión`),Bc(),Di(5,`p`),kD(6,`Evita que documentos antiguos se impriman inesperadamente cuando el PCR Print Agent vuelve a iniciar.`),Bc()(),Di(7,`div`,9)(8,`button`,10),Kp(`click`,function(){Su(e);return xu(rD().refreshCola())}),Di(9,`mat-icon`),kD(10,`refresh`),Bc(),kD(11,`Actualizar `),Bc(),Di(12,`button`,6),Kp(`click`,function(){Su(e);return xu(rD().saveCola())}),Di(13,`mat-icon`),kD(14,`save`),Bc(),kD(15),Bc()()(),VE(16,Gt,1,0,`mat-progress-bar`,7),VE(17,$t,43,13,`form`,8),Bc()}if(s&2){let e,i=rD();jv(8),qp(`disabled`,i.loadingCola()),jv(4),qp(`disabled`,!i.canEditQueue()||i.savingCola()||i.loadingCola()),jv(3),Gc(``,i.savingCola()?`Guardando...`:`Guardar seguridad`,` `),jv(),HE(i.loadingCola()?16:-1),jv(),HE((e=i.configCola())?17:-1,e)}}function Wt(s,t){s&1&&Wp(0,`mat-progress-bar`,7)}function Qt(s,t){if(s&1&&(Di(0,`mat-option`,26),kD(1),Bc()),s&2){let e=t.$implicit;qp(`value`,e.value),jv(),ph(e.label)}}function Xt(s,t){if(s&1&&(Di(0,`mat-option`,26),kD(1),Bc()),s&2){let e=t.$implicit;qp(`value`,e.value),jv(),ph(e.label)}}function Yt(s,t){if(s&1&&(Di(0,`form`,8)(1,`div`,22)(2,`mat-slide-toggle`,23),kD(3,`Impresión habilitada`),Bc(),CI(),Di(4,`span`),kD(5),Bc()(),Di(6,`div`,24)(7,`mat-form-field`,15)(8,`mat-label`),kD(9,`Modo`),Bc(),Di(10,`mat-select`,25),$E(11,Qt,2,2,`mat-option`,26,dt),Bc(),CI(),Di(13,`mat-hint`),kD(14,`Manual abre el documento; Automático lo envía al servidor de impresión.`),Bc()(),Di(15,`mat-form-field`,15)(16,`mat-label`),kD(17,`Conexión física`),Bc(),Di(18,`mat-select`,27),$E(19,Xt,2,2,`mat-option`,26,dt),Bc(),CI(),Bc(),Di(21,`mat-form-field`,28)(22,`mat-label`),kD(23,`Nombre de impresora en Windows`),Bc(),Wp(24,`input`,29),CI(),Di(25,`mat-hint`),kD(26,`Debe coincidir exactamente con Get-Printer. Ej.: 80mm Series Printer`),Bc()(),Di(27,`mat-form-field`,15)(28,`mat-label`),kD(29,`IP`),Bc(),Wp(30,`input`,30),CI(),Bc(),Di(31,`mat-form-field`,15)(32,`mat-label`),kD(33,`Puerto`),Bc(),Wp(34,`input`,31),CI(),Bc(),Di(35,`mat-form-field`,15)(36,`mat-label`),kD(37,`Ancho de papel`),Bc(),Di(38,`mat-select`,32)(39,`mat-option`,26),kD(40,`80 mm`),Bc(),Di(41,`mat-option`,26),kD(42,`58 mm`),Bc()(),CI(),Di(43,`mat-hint`),kD(44,`La plantilla automática actual está optimizada para 80 mm.`),Bc()()(),Di(45,`div`,33)(46,`mat-slide-toggle`,34),kD(47,`Imprimir ticket de venta automáticamente`),Bc(),CI(),Di(48,`mat-slide-toggle`,35),kD(49,`Imprimir documentos asociados automáticamente`),Bc(),CI(),Di(50,`mat-slide-toggle`,36),kD(51,`Separar documentos en trabajos independientes`),Bc(),CI(),Bc(),Di(52,`div`,37)(53,`mat-icon`),kD(54,`info`),Bc(),Di(55,`div`)(56,`strong`),kD(57,`Configuración global`),Bc(),Di(58,`p`),kD(59,`Los cambios afectan el flujo de impresión del sistema. La cola se controla de manera independiente en la sección anterior.`),Bc()()(),Di(60,`p`,21),kD(61),Bc()()),s&2){let e=t,i=rD();qp(`formGroup`,i.impresionForm),jv(2),qp(`disabled`,!i.canEdit()),bI(),jv(3),Gc(`Motor: `,e.motor),jv(5),qp(`disabled`,!i.canEdit()),bI(),jv(),UE(i.modos),jv(7),qp(`disabled`,!i.canEdit()),bI(),jv(),UE(i.conexiones),jv(5),qp(`readonly`,!i.canEdit()),bI(),jv(6),qp(`readonly`,!i.canEdit()),bI(),jv(4),qp(`readonly`,!i.canEdit()),bI(),jv(4),qp(`disabled`,!i.canEdit()),bI(),jv(),qp(`value`,80),jv(2),qp(`value`,58),jv(5),qp(`disabled`,!i.canEdit()),bI(),jv(2),qp(`disabled`,!i.canEdit()),bI(),jv(2),qp(`disabled`,!i.canEdit()),bI(),jv(11),hh(`Última actualización: `,e.updatedUtc||`—`,` · `,e.updatedBy||`Sistema`)}}function Jt(s,t){s&1&&Wp(0,`mat-progress-bar`,7)}function Zt(s,t){if(s&1&&(Di(0,`form`,8)(1,`div`,22)(2,`mat-slide-toggle`,38),kD(3,`Forzar texto en mayúsculas`),Bc(),CI(),Di(4,`span`),kD(5),Bc()(),Di(6,`div`,37)(7,`mat-icon`),kD(8,`spellcheck`),Bc(),Di(9,`div`)(10,`strong`),kD(11,`Evita diferencias de escritura en las constancias`),Bc(),Di(12,`p`),kD(13,`Activado: “José Pérez” se guarda como “JOSÉ PÉREZ”. Desactivado: se conserva exactamente la escritura ingresada. El Back vuelve a aplicar esta regla aunque el registro se envíe desde Postman.`),Bc()()(),Di(14,`p`,21),kD(15),Bc()()),s&2){let e=t,i=rD(2);qp(`formGroup`,i.sacramentalForm),jv(2),qp(`disabled`,!i.canEdit()),bI(),jv(3),ph(e.forzarMayusculas?`ACTIVO`:`DESACTIVADO`),jv(10),hh(`Última actualización: `,e.updatedUtc||`—`,` · `,e.updatedBy||`Sistema`)}}function Kt(s,t){if(s&1){let e=ZE();Di(0,`section`,4)(1,`div`,5)(2,`div`)(3,`h2`),kD(4,`Registros sacramentales`),Bc(),Di(5,`p`),kD(6,`Controla cómo se normaliza el texto de Bautismos, Confirmaciones, Matrimonios y sus libros.`),Bc()(),Di(7,`button`,6),Kp(`click`,function(){Su(e);return xu(rD().saveSacramental())}),Di(8,`mat-icon`),kD(9,`save`),Bc(),kD(10),Bc()(),VE(11,Jt,1,0,`mat-progress-bar`,7),VE(12,Zt,16,5,`form`,8),Bc(),Wp(13,`pcr-constancia-print-settings`)}if(s&2){let e,i=rD();jv(7),qp(`disabled`,!i.canEdit()||i.savingSacramental()||i.loadingSacramental()),jv(3),ph(i.savingSacramental()?`Guardando...`:`Guardar sacramentos`),jv(),HE(i.loadingSacramental()?11:-1),jv(),HE((e=i.configSacramental())?12:-1,e)}}var ct=class s{fb=w(Wr);api=w(u);feedback=w(p);authStore=w(x);sacramentalText=w(l$1);dialog=w(ee);moduleStore=w(m);loadingCola=qo(!1);savingCola=qo(!1);cancellingCola=qo(!1);configCola=qo(null);resumenCola=qo(null);loadingImpresion=qo(!1);savingImpresion=qo(!1);configImpresion=qo(null);loadingSacramental=qo(!1);savingSacramental=qo(!1);configSacramental=qo(null);canEdit=()=>this.authStore.hasPermission(E.CONFIGURATION_EDIT);canViewQueue=()=>this.authStore.hasPermission(E.PRINT_QUEUE_VIEW);canEditQueue=()=>this.authStore.hasPermission(E.PRINT_QUEUE_EDIT);canCancelQueue=()=>this.authStore.hasPermission(E.PRINT_QUEUE_CANCEL);hasSacramentsModule=()=>this.moduleStore.isEnabled(c.SACRAMENTS);modos=[{value:`MANUAL`,label:`Manual`},{value:`AUTOMATICO`,label:`Automático`}];conexiones=[{value:`RED`,label:`Red Ethernet`},{value:`USB`,label:`USB`},{value:`COMPARTIDA`,label:`Impresora compartida`}];colaForm=this.fb.nonNullable.group({colaHabilitada:!1,maxAntiguedadAutomaticaMinutos:[10,[Ke.required,Ke.min(1),Ke.max(1440)]],maxAntiguedadManualMinutos:[60,[Ke.required,Ke.min(1),Ke.max(10080)]]});impresionForm=this.fb.nonNullable.group({modo:this.fb.nonNullable.control(`MANUAL`),tipoConexion:this.fb.nonNullable.control(`RED`),nombreImpresoraWindows:[``,[Ke.required,Ke.maxLength(150)]],direccionIp:[``,Ke.maxLength(45)],puerto:[9100,[Ke.min(1),Ke.max(65535)]],anchoPapelMm:[80,Ke.required],imprimirTicketVenta:!0,imprimirDocumentosAsociados:!0,cortarEntreDocumentos:!0,isActive:!0});sacramentalForm=this.fb.nonNullable.group({forzarMayusculas:!0});ngOnInit(){this.canViewQueue()&&this.loadCola(),this.loadImpresion(),this.hasSacramentsModule()&&this.loadSacramental()}saveCola(){if(!this.canEditQueue()||this.savingCola()||(this.colaForm.markAllAsTouched(),this.colaForm.invalid))return;let t=this.configCola();if(!t)return;let e=this.colaForm.getRawValue();this.savingCola.set(!0),this.api.updateColaImpresion(l(k({},e),{rowVersion:t.rowVersion})).subscribe({next:i=>{this.savingCola.set(!1),this.applyCola(i),this.loadResumenCola(),this.feedback.success(i.colaHabilitada?`Cola de impresión habilitada.`:`Cola de impresión pausada.`)},error:i=>{this.savingCola.set(!1),this.feedback.error(K(i,`No se pudo actualizar la seguridad de la cola.`))}})}refreshCola(){this.canViewQueue()&&this.loadCola()}cancelarPendientes(){if(!this.canCancelQueue()||this.cancellingCola())return;let t=this.resumenCola()?.pendientes??0;if(t<=0){this.feedback.warning(`No hay trabajos pendientes para cancelar.`);return}this.dialog.open(v,{width:`min(560px, calc(100vw - 2rem))`,data:{title:`Cancelar trabajos pendientes`,message:`Se cancelar\xE1n ${t} trabajo(s) PENDIENTE. Los trabajos que ya est\xE9n PROCESANDO no se interrumpir\xE1n. Esta acci\xF3n evita que se impriman al reanudar el agente.`,cancelText:`Volver`,confirmText:`Cancelar pendientes`,icon:`delete_sweep`}}).afterClosed().subscribe(e=>{e&&(this.cancellingCola.set(!0),this.api.cancelarPendientesColaImpresion().subscribe({next:i=>{this.cancellingCola.set(!1),this.feedback.success(i.mensaje),this.loadResumenCola()},error:i=>{this.cancellingCola.set(!1),this.feedback.error(K(i,`No se pudieron cancelar los trabajos pendientes.`))}}))})}saveImpresion(){if(!this.canEdit()||this.savingImpresion()||(this.impresionForm.markAllAsTouched(),this.impresionForm.invalid))return;let t=this.configImpresion();if(!t)return;let e=this.impresionForm.getRawValue();this.savingImpresion.set(!0),this.api.updateImpresion(l(k({},e),{direccionIp:e.direccionIp.trim()||null,nombreImpresoraWindows:e.nombreImpresoraWindows.trim(),puerto:e.puerto||null,rowVersion:t.rowVersion})).subscribe({next:i=>{this.savingImpresion.set(!1),this.applyImpresion(i),this.feedback.success(`Configuración de impresión actualizada.`)},error:i=>{this.savingImpresion.set(!1),this.feedback.error(K(i,`No se pudo actualizar la configuración de impresión.`))}})}saveSacramental(){if(!this.hasSacramentsModule()||!this.canEdit()||this.savingSacramental())return;let t=this.configSacramental();t&&(this.savingSacramental.set(!0),this.api.updateSacramental({forzarMayusculas:this.sacramentalForm.controls.forzarMayusculas.value,rowVersion:t.rowVersion}).subscribe({next:e=>{this.savingSacramental.set(!1),this.applySacramental(e),this.feedback.success(`Configuración de registros sacramentales actualizada.`)},error:e=>{this.savingSacramental.set(!1),this.feedback.error(K(e,`No se pudo actualizar la configuración de registros sacramentales.`))}}))}loadCola(){this.loadingCola.set(!0),this.api.getColaImpresion().subscribe({next:t=>{this.applyCola(t),this.loadResumenCola()},error:t=>{this.loadingCola.set(!1),this.feedback.error(K(t,`No se pudo cargar la seguridad de la cola de impresión.`))}})}loadResumenCola(){this.api.getResumenColaImpresion().subscribe({next:t=>{this.resumenCola.set(t),this.loadingCola.set(!1)},error:t=>{this.loadingCola.set(!1),this.feedback.error(K(t,`No se pudo consultar el estado de la cola de impresión.`))}})}loadImpresion(){this.loadingImpresion.set(!0),this.api.getImpresion().subscribe({next:t=>{this.loadingImpresion.set(!1),this.applyImpresion(t)},error:t=>{this.loadingImpresion.set(!1),this.feedback.error(K(t,`No se pudo cargar la configuración de impresión.`))}})}loadSacramental(){this.loadingSacramental.set(!0),this.api.getSacramental().subscribe({next:t=>{this.loadingSacramental.set(!1),this.applySacramental(t)},error:t=>{this.loadingSacramental.set(!1),this.feedback.error(K(t,`No se pudo cargar la configuración de registros sacramentales.`))}})}applyCola(t){this.configCola.set(t),this.colaForm.reset({colaHabilitada:t.colaHabilitada,maxAntiguedadAutomaticaMinutos:t.maxAntiguedadAutomaticaMinutos,maxAntiguedadManualMinutos:t.maxAntiguedadManualMinutos})}applyImpresion(t){this.configImpresion.set(t),this.impresionForm.reset({modo:t.modo,tipoConexion:t.tipoConexion,nombreImpresoraWindows:t.nombreImpresoraWindows,direccionIp:t.direccionIp??``,puerto:t.puerto??9100,anchoPapelMm:t.anchoPapelMm,imprimirTicketVenta:t.imprimirTicketVenta,imprimirDocumentosAsociados:t.imprimirDocumentosAsociados,cortarEntreDocumentos:t.cortarEntreDocumentos,isActive:t.isActive})}applySacramental(t){this.configSacramental.set(t),this.sacramentalForm.reset({forzarMayusculas:t.forzarMayusculas}),this.sacramentalText.setForzarMayusculas(t.forzarMayusculas)}static ɵfac=function(e){return new(e||s)};static ɵcmp=pE({type:s,selectors:[[`pcr-configuracion-impresion`]],decls:24,vars:6,consts:[[1,`config-page`],[1,`page-header`],[1,`eyebrow`],[1,`config-section`,`queue-section`],[1,`config-section`],[1,`section-title`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`],[`mode`,`indeterminate`],[1,`config-card`,3,`formGroup`],[1,`section-actions`],[`mat-button`,``,`type`,`button`,3,`click`,`disabled`],[1,`queue-state`],[`formControlName`,`colaHabilitada`,3,`disabled`],[1,`queue-summary`],[1,`form-grid`,`queue-expiration-grid`],[`appearance`,`outline`],[`matInput`,``,`type`,`number`,`formControlName`,`maxAntiguedadAutomaticaMinutos`,3,`readonly`],[`matInput`,``,`type`,`number`,`formControlName`,`maxAntiguedadManualMinutos`,3,`readonly`],[1,`queue-danger`],[`mat-stroked-button`,``,`type`,`button`,3,`click`,`disabled`],[1,`note`,`warning-note`],[1,`updated`],[1,`status-row`],[`formControlName`,`isActive`,3,`disabled`],[1,`form-grid`],[`formControlName`,`modo`,3,`disabled`],[3,`value`],[`formControlName`,`tipoConexion`,3,`disabled`],[`appearance`,`outline`,1,`wide`],[`matInput`,``,`formControlName`,`nombreImpresoraWindows`,3,`readonly`],[`matInput`,``,`formControlName`,`direccionIp`,`placeholder`,`192.168.1.114`,3,`readonly`],[`matInput`,``,`type`,`number`,`formControlName`,`puerto`,3,`readonly`],[`formControlName`,`anchoPapelMm`,3,`disabled`],[1,`options`],[`formControlName`,`imprimirTicketVenta`,3,`disabled`],[`formControlName`,`imprimirDocumentosAsociados`,3,`disabled`],[`formControlName`,`cortarEntreDocumentos`,3,`disabled`],[1,`note`],[`formControlName`,`forzarMayusculas`,3,`disabled`]],template:function(e,i){if(e&1&&(Di(0,`section`,0)(1,`header`,1)(2,`div`)(3,`p`,2),kD(4,`Configuración general`),Bc(),Di(5,`h1`),kD(6,`Parámetros del sistema`),Bc(),Di(7,`p`),kD(8,`Administra la seguridad de la cola, la impresión general, los registros sacramentales y la calibración de constancias oficiales.`),Bc()()(),VE(9,Ht,18,5,`section`,3),Di(10,`section`,4)(11,`div`,5)(12,`div`)(13,`h2`),kD(14,`Impresión`),Bc(),Di(15,`p`),kD(16,`Define el comportamiento global de la ticketera utilizada por el sistema.`),Bc()(),Di(17,`button`,6),Kp(`click`,function(){return i.saveImpresion()}),Di(18,`mat-icon`),kD(19,`save`),Bc(),kD(20),Bc()(),VE(21,Wt,1,0,`mat-progress-bar`,7),VE(22,Yt,62,16,`form`,8),Bc(),VE(23,Kt,14,4),Bc()),e&2){let r;jv(9),HE(i.canViewQueue()?9:-1),jv(8),qp(`disabled`,!i.canEdit()||i.savingImpresion()||i.loadingImpresion()),jv(3),ph(i.savingImpresion()?`Guardando...`:`Guardar impresión`),jv(),HE(i.loadingImpresion()?21:-1),jv(),HE((r=i.configImpresion())?22:-1,r),jv(),HE(i.hasSacramentsModule()?23:-1)}},dependencies:[Qr,Hr,Yt$1,Oi$1,Br,zr,zi,ji,Fi,Oi,Ht$1,Do,Hn,ht,pt$1,yt,wt$1,Be,Pe,q$1,U,Pi,Fi$1,X,lt,_e,be],styles:[`.config-page[_ngcontent-%COMP%]{display:grid;gap:1.4rem}.page-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin:.1rem 0}.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .section-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;opacity:.7}.eyebrow[_ngcontent-%COMP%]{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--%NS%mat-sys-primary)}.config-section[_ngcontent-%COMP%]{display:grid;gap:.75rem}.section-title[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}.section-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 .2rem}.config-card[_ngcontent-%COMP%]{padding:1.2rem;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:1rem;background:var(--%NS%mat-sys-surface);display:grid;gap:1.2rem}.status-row[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:1rem}.status-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .updated[_ngcontent-%COMP%]{font-size:.78rem;opacity:.68}.form-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem 1rem}.wide[_ngcontent-%COMP%]{grid-column:1/-1}.options[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.note[_ngcontent-%COMP%]{display:flex;gap:.75rem;padding:.9rem;border-radius:.8rem;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:.15rem 0 0;font-size:.82rem}.updated[_ngcontent-%COMP%]{margin:0}@media(max-width:760px){.page-header[_ngcontent-%COMP%], .section-title[_ngcontent-%COMP%]{flex-direction:column;align-items:stretch}.section-title[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%}.form-grid[_ngcontent-%COMP%], .options[_ngcontent-%COMP%]{grid-template-columns:1fr}.wide[_ngcontent-%COMP%]{grid-column:auto}.status-row[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column}}.section-actions[_ngcontent-%COMP%]{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}.queue-state[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1rem;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:12px;margin-bottom:1rem}.queue-state[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;margin-bottom:.25rem}.queue-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;color:var(--%NS%mat-sys-on-surface-variant)}.queue-state--paused[_ngcontent-%COMP%]{border-style:dashed}.queue-summary[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;margin:1rem 0}.queue-summary[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:12px;padding:.9rem 1rem;display:flex;flex-direction:column;gap:.25rem}.queue-summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font-size:.84rem}.queue-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:1.45rem}.queue-expiration-grid[_ngcontent-%COMP%]{margin-top:.5rem}.queue-danger[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:1rem;align-items:center;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:12px;padding:1rem;margin-top:.5rem}.queue-danger[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block;margin-bottom:.25rem}.queue-danger[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;color:var(--%NS%mat-sys-on-surface-variant)}.warning-note[_ngcontent-%COMP%]{margin-top:1rem}@media(max-width:760px){.queue-state[_ngcontent-%COMP%], .queue-danger[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column}.queue-summary[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(0,1fr))}}`]})};export{ct as ConfiguracionImpresionPage};