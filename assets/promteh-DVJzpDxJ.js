import{W as Y,A as ee,S as ae,P as te,O as oe,a as re,c as ne,d as L,e as se,f as R,g as T,h as ie,i as le,j as ce,k as N,b as de,m as ue,H as ve,G as fe,C as pe}from"./decode-BLORC4i7.js";const me={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float h;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

			gl_FragColor = sum;

		}`},ge={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float v;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

			gl_FragColor = sum;

		}`},he="/constructor-demo/small_empty_room_3_1k.jpg",be="/constructor-demo/bags.glb",I=["C1","C2","C2-A","C3","C3-A","C4"],V=["F1","F2","F3","F4"],W=2.5,z=2.5,ye=.3,a={color:"#000000",backgroundColor:{},shadow:{blur:1.5,darkness:1,opacity:.5},plane:{color:"#ffffff",opacity:1,y:-.1},flap:I[0],body:V[0],laceColor:"#ffffff",lace:!1,bumps:!1};xe();async function xe(){const r=document.querySelector("#container"),b=document.querySelector("#canvas");let l=r.offsetWidth,u=r.offsetHeight;const o=new Y({canvas:b,alpha:!0,antialias:!0});o.setSize(l,u),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.toneMapping=ee,o.toneMappingExposure=1,o.setClearAlpha(0);const q=new pe,n=new ae,y=new te(45,l/u,.1,50);y.position.set(0,0,5);const A=new oe(y,b);A.enableDamping=!0,window.addEventListener("resize",Q);const[x,$]=await Promise.all([we(be),De(he,o)]),X=new re(o);n.environment=X.fromEquirectangular($).texture,n.add(x);const c=new ne;c.position.y=a.plane.y,n.add(c);const D=new L(512,512);D.texture.generateMipmaps=!1;const P=new L(512,512);P.texture.generateMipmaps=!1;const S=new se(W,z).rotateX(Math.PI/2),Z=new R({map:D.texture,opacity:a.shadow.opacity,transparent:!0,depthWrite:!1}),B=new T(S,Z);B.renderOrder=1,c.add(B),B.scale.y=-1;const s=new T(S);s.visible=!1,c.add(s);const J=new R({color:a.plane.color,opacity:a.plane.opacity,transparent:!0,depthWrite:!1}),M=new T(S,J);M.rotateX(Math.PI),c.add(M);const v=new ie(-2.5/2,W/2,z/2,-2.5/2,0,ye);v.rotation.x=Math.PI/2,c.add(v);const _=new le(v),d=new ce;d.userData.darkness={value:a.shadow.darkness},d.onBeforeCompile=function(e){e.uniforms.darkness=d.userData.darkness,e.fragmentShader=`
						uniform float darkness;
						${e.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );","gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );")}
					`},d.depthTest=!1,d.depthWrite=!1;const F=new N(me);F.depthTest=!1;const E=new N(ge);E.depthTest=!1;const w={};V.forEach(e=>{const t=x.getObjectByName(e);t&&(w[e]=t)});const U={};I.forEach(e=>{console.log(e);const t=x.getObjectByName(e);t&&(U[e]=t)});function H(e){Object.values(w).forEach(t=>{var i,C;(C=(i=t.material)==null?void 0:i.color)==null||C.set(e)}),Object.values(U).forEach(t=>{var i,C;(C=(i=t.material)==null?void 0:i.color)==null||C.set(e)})}H(a.color);const f={lace:x.getObjectByName("Lace"),bumps:x.getObjectByName("Bumps")};Object.values(w).forEach(e=>{e.visible=e.name===a.body}),Object.values(U).forEach(e=>{e.visible=e.name===a.flap}),f.lace.visible=a.lace,f.lace.getObjectByName("NurbsPath001_1").material.color.set(a.laceColor),f.bumps.visible=a.bumps;const k=new de({title:"Parameters",expanded:!0}),p=k.addFolder({title:"Model"});p.addBinding(a,"color").on("change",({value:e})=>{H(e)}),p.addBinding(a,"body",{options:w}).on("change",({value:e})=>{Object.values(w).forEach(t=>{t.visible=t===e})}),p.addBinding(a,"flap",{options:U}).on("change",({value:e})=>{Object.values(U).forEach(t=>{t.visible=t===e})}),p.addBinding(a,"lace",{label:"Lace"}).on("change",({value:e})=>{f.lace.visible=e}),p.addBinding(a,"laceColor",{label:"Lace Color"}).on("change",({value:e})=>{f.lace.getObjectByName("NurbsPath001_1").material.color.set(e)}),p.addBinding(a,"bumps",{label:"Bumps"}).on("change",({value:e})=>{f.bumps.visible=e});const m=(e,t)=>getComputedStyle(r).getPropertyValue(e)||t;a.backgroundColor={stop1:{position:parseFloat(m("--p-1","0")),color:m("--bg-1","#ffffff")},stop2:{position:parseFloat(m("--p-2","50")),color:m("--bg-2","#ffffff")},stop3:{position:parseFloat(m("--p-3","100")),color:m("--bg-3","#ffffff")}};const g=k.addFolder({title:"Background"});g.addBinding(a.backgroundColor.stop1,"position",{step:1,min:-50,max:150}).on("change",h),g.addBinding(a.backgroundColor.stop1,"color").on("change",h),g.addBinding(a.backgroundColor.stop2,"position",{step:1,min:-50,max:150}).on("change",h),g.addBinding(a.backgroundColor.stop2,"color").on("change",h),g.addBinding(a.backgroundColor.stop3,"position",{step:1,min:-50,max:150}).on("change",h),g.addBinding(a.backgroundColor.stop3,"color").on("change",h);const j=k.addFolder({title:"Shadow"});j.addBinding(a.shadow,"blur",{min:0,max:15,step:.1}),j.addBinding(a.shadow,"darkness",{min:1,max:5,step:.1}).on("change",()=>{d.userData.darkness.value=a.shadow.darkness}),j.addBinding(a.shadow,"opacity",{min:0,max:1,step:.1}).on("change",()=>{B.material.opacity=a.shadow.opacity});const O=k.addFolder({title:"Plane"});O.addBinding(a.plane,"color").on("change",({value:e})=>{M.material.color.set(e)}),O.addBinding(a.plane,"opacity",{min:0,max:1,step:.1}).on("change",({value:e})=>{M.material.opacity=e}),O.addBinding(a.plane,"y",{min:-.5,max:.1,step:.01}).on("change",({value:e})=>{c.position.y=e});function G(e){s.visible=!0,s.material=F,s.material.uniforms.tDiffuse.value=D.texture,F.uniforms.h.value=e*1/256,o.setRenderTarget(P),o.render(s,v),s.material=E,s.material.uniforms.tDiffuse.value=P.texture,E.uniforms.v.value=e*1/256,o.setRenderTarget(D),o.render(s,v),s.visible=!1}ue.add(K),window.scene=n;function K(){A.update(q.getDelta());const e=n.background;n.background=null,_.visible=!1,n.overrideMaterial=d;const t=o.getClearAlpha();o.setClearAlpha(0),o.setRenderTarget(D),o.render(n,v),n.overrideMaterial=null,_.visible=!0,G(a.shadow.blur),G(a.shadow.blur*.4),o.setRenderTarget(null),o.setClearAlpha(t),n.background=e,o.render(n,y)}function Q(){l=r.offsetWidth,u=r.offsetHeight,y.aspect=l/u,y.updateProjectionMatrix(),o.setSize(l,u)}function h(){Object.values(a.backgroundColor).forEach(({position:e,color:t},i)=>{r.style.setProperty(`--p-${i+1}`,e+"%"),r.style.setProperty(`--bg-${i+1}`,t)})}}async function De(r,b){return(await new ve(b).loadAsync(r)).renderTarget.texture}async function we(r){return(await new fe().loadAsync(r)).scene}
