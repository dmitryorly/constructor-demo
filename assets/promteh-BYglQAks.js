import{W as q,A as $,S as N,P as X,O as Z,a as J,c as K,d as A,e as Q,f as G,g as P,h as Y,i as ee,j as ae,k as _,b as te,m as re,H as oe,G as ne,C as se}from"./decode-BLORC4i7.js";const ie={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},le={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`},ce="/constructor-demo/small_empty_room_3_1k.jpg",de="/constructor-demo/bag-01-no-color.glb",R=2.5,E=2.5,ue=.3,e={color:"#000000",backgroundColor:{},shadow:{blur:1.5,darkness:1,opacity:.5},plane:{color:"#ffffff",opacity:1,y:-1.1}};ve();async function ve(){const r=document.querySelector("#container"),m=document.querySelector("#canvas");let i=r.offsetWidth,d=r.offsetHeight;const t=new q({canvas:m,alpha:!0,antialias:!0});t.setSize(i,d),t.setPixelRatio(Math.min(window.devicePixelRatio,2)),t.toneMapping=$,t.toneMappingExposure=1,t.setClearAlpha(0);const L=new se,o=new N,g=new X(45,i/d,.1,50);g.position.set(0,0,5);const S=new Z(g,m);S.enableDamping=!0,window.addEventListener("resize",V);const[w,W]=await Promise.all([pe(de),fe(ce,t)]),z=new J(t);o.environment=z.fromEquirectangular(W).texture,o.add(w),w.traverse(a=>{a.isMesh&&a.name!=="Фурнитура"&&a.material.color.set(e.color)});const l=new K;l.position.y=e.plane.y,o.add(l);const h=new A(512,512);h.texture.generateMipmaps=!1;const U=new A(512,512);U.texture.generateMipmaps=!1;const b=new Q(R,E).rotateX(Math.PI/2),j=new G({map:h.texture,opacity:e.shadow.opacity,transparent:!0,depthWrite:!1}),x=new P(b,j);x.renderOrder=1,l.add(x),x.scale.y=-1;const n=new P(b);n.visible=!1,l.add(n);const I=new G({color:e.plane.color,opacity:e.plane.opacity,transparent:!0,depthWrite:!1}),y=new P(b,I);y.rotateX(Math.PI),l.add(y);const u=new Y(-2.5/2,R/2,E/2,-2.5/2,0,ue);u.rotation.x=Math.PI/2,l.add(u);const T=new ee(u),c=new ae;c.userData.darkness={value:e.shadow.darkness},c.onBeforeCompile=function(a){a.uniforms.darkness=c.userData.darkness,a.fragmentShader=`
						uniform float darkness;
						${a.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );","gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );")}
					`},c.depthTest=!1,c.depthWrite=!1;const M=new _(ie);M.depthTest=!1;const C=new _(le);C.depthTest=!1;const D=new te;D.addBinding(e,"color").on("change",({value:a})=>{w.traverse(s=>{s.isMesh&&s.name!=="Фурнитура"&&s.material.color.set(a)})});const v=(a,s)=>getComputedStyle(r).getPropertyValue(a)||s;e.backgroundColor={stop1:{position:parseFloat(v("--p-1","0")),color:v("--bg-1","#ffffff")},stop2:{position:parseFloat(v("--p-2","50")),color:v("--bg-2","#ffffff")},stop3:{position:parseFloat(v("--p-3","100")),color:v("--bg-3","#ffffff")}};const f=D.addFolder({title:"Background"});f.addBinding(e.backgroundColor.stop1,"position",{step:1,min:-50,max:150}).on("change",p),f.addBinding(e.backgroundColor.stop1,"color").on("change",p),f.addBinding(e.backgroundColor.stop2,"position",{step:1,min:-50,max:150}).on("change",p),f.addBinding(e.backgroundColor.stop2,"color").on("change",p),f.addBinding(e.backgroundColor.stop3,"position",{step:1,min:-50,max:150}).on("change",p),f.addBinding(e.backgroundColor.stop3,"color").on("change",p);const k=D.addFolder({title:"Shadow"});k.addBinding(e.shadow,"blur",{min:0,max:15,step:.1}),k.addBinding(e.shadow,"darkness",{min:1,max:5,step:.1}).on("change",()=>{c.userData.darkness.value=e.shadow.darkness}),k.addBinding(e.shadow,"opacity",{min:0,max:1,step:.1}).on("change",()=>{x.material.opacity=e.shadow.opacity});const B=D.addFolder({title:"Plane"});B.addBinding(e.plane,"color").on("change",({value:a})=>{y.material.color.set(a)}),B.addBinding(e.plane,"opacity",{min:0,max:1,step:.1}).on("change",({value:a})=>{y.material.opacity=a}),B.addBinding(e.plane,"y",{min:-1.4,max:-1,step:.01}).on("change",({value:a})=>{l.position.y=a});function F(a){n.visible=!0,n.material=M,n.material.uniforms.tDiffuse.value=h.texture,M.uniforms.h.value=a*1/256,t.setRenderTarget(U),t.render(n,u),n.material=C,n.material.uniforms.tDiffuse.value=U.texture,C.uniforms.v.value=a*1/256,t.setRenderTarget(h),t.render(n,u),n.visible=!1}re.add(O),window.scene=o;function O(){S.update(L.getDelta());const a=o.background;o.background=null,T.visible=!1,o.overrideMaterial=c;const s=t.getClearAlpha();t.setClearAlpha(0),t.setRenderTarget(h),t.render(o,u),o.overrideMaterial=null,T.visible=!0,F(e.shadow.blur),F(e.shadow.blur*.4),t.setRenderTarget(null),t.setClearAlpha(s),o.background=a,t.render(o,g)}function V(){i=r.offsetWidth,d=r.offsetHeight,g.aspect=i/d,g.updateProjectionMatrix(),t.setSize(i,d)}function p(){Object.values(e.backgroundColor).forEach(({position:a,color:s},H)=>{r.style.setProperty(`--p-${H+1}`,a+"%"),r.style.setProperty(`--bg-${H+1}`,s)})}}async function fe(r,m){return(await new oe(m).loadAsync(r)).renderTarget.texture}async function pe(r){return(await new ne().loadAsync(r)).scene}
