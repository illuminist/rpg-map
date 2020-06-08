(this["webpackJsonprpg-map"]=this["webpackJsonprpg-map"]||[]).push([[0],{106:function(e,t,n){e.exports=n(226)},111:function(e,t,n){},226:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(48),i=n.n(o),c=(n(111),n(69)),l=n.n(c),s=n(99),u=n.n(s),d=n(100),m=n.n(d),f=n(241),p=function(e,t){return Object(f.a)(e,m()(t,"name"))},b=p((function(e){return{root:{},layer:{position:"absolute",top:0,left:0,userSelect:"none"}}}),{name:"GameMap",index:1}),h=n(18),g=p((function(e){return{root:{}}}),{name:"ImageLayer",index:1}),y=function(e){return e&&e.startsWith("/")?"/rpg-map"+e:e},v=function(e){var t=g(e),n=e.className,r=e.layerId,o=e.layerDef;return a.createElement("div",{className:Object(h.a)(n,t.root)},a.createElement("img",{src:y(o.src),alt:r}))};v.defaultProps={};var w=v,j=n(16),O=n.n(j),x=n(33),E=n(103),k=n(14),C=n(15),D=n(20),S=n.n(D),I=p((function(e){return{root:{},tileSize:function(e){return{width:e.width,height:e.height}},tile:{backgroundColor:"rgba(255,0,0,0.3)",position:"absolute",borderStyle:"solid",borderColor:"rgba(255,0,0,0.3)",borderWidth:1},walkable:{backgroundColor:"unset",borderColor:"rgba(0,255,0,0.1)"},displayMove:{backgroundColor:"rgba(0,255,0,0.3)",cursor:"cell"}}}),{name:"ObjectLayer",index:1}),M=function(e,t){var n=a.useRef({deps:t,runningCount:0});n.current.deps=t,a.useEffect((function(){var a={isCurrent:!0,deps:t};return n.current.runningCount++,e(a,n.current).finally((function(){console.log("async fin"),n.current.runningCount--})),function(){a.isCurrent=!1}}),t)},z=n(3),P=p((function(e){return{root:{position:"absolute",userSelect:"none"}}}),{name:"GameObject",index:1}),N=n(6),R=function(e){return[{x:e.x+1,y:e.y},{x:e.x-1,y:e.y},{x:e.x,y:e.y-1},{x:e.x,y:e.y+1}]},F=function(e){return e.x+","+e.y},L=Object(N.c)("initMap",function(){var e=Object(x.a)(O.a.mark((function e(t,n){var a;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.dispatch,e.next=3,a(Z());case 3:return e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),T=Object(N.b)("selectObject"),W=Object(N.b)("deselectObject"),Y=Object(N.b)("moveObject"),X=Object(N.c)("walkObject",function(){var e=Object(x.a)(O.a.mark((function e(t,n){var a,r,o,i;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=n.dispatch,r=n.getState,o=r(),i=Object(k.a)({},t,{objectId:"objectId"in t?t.objectId:o.map.selected}),a(Y(i));case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),Z=Object(N.c)("prepareWalkableLayer",function(){var e=Object(x.a)(O.a.mark((function e(t,n){var a,r,o;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.getState,r=a().map,o={},e.next=5,Promise.all(Object.keys(r.layerDefs).map((function(e){return new Promise((function(t){var n=r.layerDefs[e];if(n.walkable&&"src"in n.walkable){var a=document.createElement("img");a.src=y(n.walkable.src),a.onload=function(){var n=document.createElement("canvas");n.width=a.width,n.height=a.height;var i=n.getContext("2d");if(!i)throw new Error("not-support-canvas");i.drawImage(a,0,0,a.width,a.height);var c=S.a.times(r.gridCount.height,(function(e){return S.a.times(r.gridCount.width,(function(t){return i.getImageData(t*r.gridSize.width+r.gridSize.width/2,e*r.gridSize.height+r.gridSize.height/2,1,1).data[0]?0:1}))}));o[e]=c,t()}}else t()}))})));case 5:return e.abrupt("return",o);case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),A=Object(N.d)(null,(function(e){return e.addCase(L.pending,(function(e,t){return Object(k.a)({},S.a.cloneDeep(t.meta.arg),{selected:null,animating:!1,moveableDisplay:null,loaded:!1})})).addCase(L.fulfilled,(function(e,t){e.loaded=!0})).addCase(Z.fulfilled,(function(e,t){console.log(t),Object.keys(t.payload).forEach((function(n){e.layerDefs[n].walkable=t.payload[n]}))})).addCase(T,(function(e,t){var n=e.objectDefs[t.payload];if(null===n||void 0===n?void 0:n.stat.movementRange){e.selected=t.payload,e.moveableDisplay={};var a=new Map;a.set(F(n.position),Number.POSITIVE_INFINITY);R(n.position).forEach((function(t){return function t(n,r){r<=0||(!a.has(F(n))||a.get(F(n))>r)&&(a.set(F(n),r),e.moveableDisplay[F(n)]=!0,R(n).filter((function(e){return!a.has(F(e))})).forEach((function(e){return t(e,r-1)})))}(t,n.stat.movementRange)}))}})).addCase(W,(function(e,t){e.selected=null,e.moveableDisplay=null})).addCase(Y,(function(e,t){e.objectDefs[t.payload.objectId].position=t.payload.destination,e.selected=null,e.moveableDisplay=null})).addCase(X.pending,(function(e,t){e.animating=!0})).addCase(X.fulfilled,(function(e,t){e.animating=!1}))})),B=function(e){var t=P(e),n=e.className,r=e.objectId,o=Object(z.b)(),i=Object(z.c)((function(e){return e.map.gridSize})),c=Object(z.c)((function(e){return e.map.objectDefs[r]})),l=Object(z.c)((function(e){return e.map.spriteDefs[c.sprite]})),s=Object(z.c)((function(){return!0})),u={transform:"translate(".concat(i.width*c.position.x,"px,").concat(i.height*c.position.y,"px)"),cursor:s?"pointer":"default"};switch(l.type){case"image":return a.createElement("img",{alt:"".concat(r,":").concat(c.sprite),className:Object(h.a)(n,t.root),style:u,src:y(l.src),onClick:s?function(){o(T(r))}:void 0,draggable:!1});default:return null}};B.defaultProps={};var H=B,G=a.memo((function(e){var t,n=e.x,r=e.y,o=e.classes,i=e.layerId,c=Object(z.c)((function(e){return e.map.gridSize})),l=Object(z.c)((function(e){var t;return null===(t=e.map.moveableDisplay)||void 0===t?void 0:t[n+","+r]})),s=Object(z.c)((function(e){var t,a=null===(t=e.map.layerDefs)||void 0===t?void 0:t[i];return"walkable"in a&&a.walkable[r][n]})),u=Object(z.b)();return a.createElement("div",{key:r+":"+n,style:{top:r*c.height,left:n*c.width},className:Object(h.a)(o.tile,o.tileSize,(t={},Object(C.a)(t,o.walkable,s),Object(C.a)(t,o.displayMove,s&&l),t)),onClick:s&&l?function(){return u(X({destination:{x:n,y:r}}))}:void 0})})),J=a.memo((function(e){var t=e.layerId,n=Object(z.c)((function(e){return e.map.gridSize})),r=Object(z.c)((function(e){return e.map.gridCount})),o=I(Object(k.a)({},n));return a.createElement("div",{className:Object(h.a)(o.root)},S.a.times(r.height,(function(e){return S.a.times(r.width,(function(n){return a.createElement(G,{x:n,y:e,classes:o,layerId:t})}))})))})),q=function(e){e.className;var t=e.layerDef,n=e.layerId,r=Object(z.c)((function(e){return e.map.gridSize})),o=Object(z.c)((function(e){return e.map.gridCount})),i=Object(z.c)((function(e){return e.map.objectDefs})),c=(I(Object(k.a)({},r)),a.useState("src"in t.walkable?null:t.walkable)),l=Object(E.a)(c,2),s=l[0],u=l[1];return M(function(){var e=Object(x.a)(O.a.mark((function e(n){var a;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:!s&&"src"in t.walkable&&((a=document.createElement("img")).src=y(t.walkable.src),a.onload=function(){if(n.isCurrent){var e=document.createElement("canvas");e.width=a.width,e.height=a.height;var t=e.getContext("2d");if(!t)throw new Error("not-support-canvas");t.drawImage(a,0,0,a.width,a.height);var i=S.a.times(o.height,(function(e){return S.a.times(o.width,(function(n){return t.getImageData(n*r.width+r.width/2,e*r.height+r.height/2,1,1).data[0]?0:1}))}));u(i)}});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[o,r,s,t.walkable]),s&&a.createElement(a.Fragment,null,a.createElement(J,{layerId:n}),Object.keys(i).filter((function(e){return i[e].layer===n})).map((function(e){return a.createElement(H,{key:e,objectId:e})})))};q.defaultProps={};var K=q,V=p((function(e){return{root:{position:"fixed",height:"100%",width:"100%"},layerContainer:{transformOrigin:"0 0",position:"fixed",top:0,left:0,height:"100%",width:"100%"},controlInstruction:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",backgroundColor:"rgba(0,0,0,0.3)",color:"white",borderTopRightRadius:e.shape.borderRadius,borderTopLeftRadius:e.shape.borderRadius,padding:16}}}),{name:"CameraControl",index:1}),$=n(55),_=Object(N.b)("cameraMoveStart"),Q=Object(N.b)("cameraZoomRelative"),U=Object(N.b)("cameraMoveRelative"),ee=Object(N.b)("cameraMoveSourceRelative"),te=Object(N.b)("cameraMoveEnd"),ne=Object(N.b)("cameraZoomStart"),ae=Object(N.b)("cameraZoomEnd"),re=Object(N.d)({isMoving:!1,cameraOriginalPosition:null,moveSourcePosition:null,position:{x:0,y:0},zoom:1,isZooming:!1},(function(e){return e.addCase(_,(function(e,t){e.isMoving=!0,e.moveSourcePosition=t.payload.sourcePosition,e.cameraOriginalPosition=Object(k.a)({},e.position)})).addCase(te,(function(e,t){e.isMoving=!1})).addCase(U,(function(e,t){e.position.x+=t.payload.x,e.position.y+=t.payload.y})).addCase(ee,(function(e,t){e.position.x=e.cameraOriginalPosition.x+e.moveSourcePosition.x-t.payload.x,e.position.y=e.cameraOriginalPosition.y+e.moveSourcePosition.y-t.payload.y})).addCase(ne,(function(e,t){e.isZooming=!0})).addCase(ae,(function(e,t){e.isZooming=!1})).addCase(Q,(function(e,t){var n=t.payload,a=n.center,r=n.zoom,o=n.screen,i=e.zoom,c=Math.min(4,Math.max(.25,e.zoom+r)),l=c/i,s=c-i,u=a.x-o.width/2,d=a.y-o.height/2,m=u*-l*1,f=d*-l*1,p=(e.position.x+u)/i*-s*1,b=(e.position.y+d)/i*-s*1,h=Math.sqrt(u*u+d*d),g=.5*Math.min(1,1/h*20),y=p-(p-m)*g,v=b-(b-f)*g,w={x:e.position.x-y,y:e.position.y-v};e.zoom=c,e.position=w}))})),oe=function(e){var t=e.children,n=V({}),r=Object(z.c)((function(e){return e.camera})),o=Object(z.b)(),i=a.useRef(null);a.useEffect((function(){var e=function(e){1===e.button&&o(te())},t=function(e){i.current&&o(Q({zoom:-e.deltaY/200,center:{x:e.pageX,y:e.pageY},screen:{width:i.current.clientWidth,height:i.current.clientHeight}}))};return window.addEventListener("mouseup",e),window.addEventListener("wheel",t),function(){window.removeEventListener("mouseup",e),window.removeEventListener("wheel",t)}}),[o]);var c=Object($.c)({transform:"translate(50%,50%) translate(".concat(-r.position.x,"px,").concat(-r.position.y,"px) scale(").concat(r.zoom,")"),config:$.b.stiff}).transform;return a.createElement("div",{ref:i,className:Object(h.a)(n.root),onMouseDown:function(e){1===e.button&&o(_({sourcePosition:{x:e.pageX,y:e.pageY}}))},onMouseMove:function(e){r.isMoving&&o(ee({x:e.pageX,y:e.pageY}))},onTouchStart:function(e){console.log(e.touches),1===e.touches.length?o(_({sourcePosition:{x:e.touches[0].pageX,y:e.touches[0].pageY}})):2===e.touches.length&&(o(te()),o(ne()))},onTouchMove:function(e){console.log(e.touches),r.isMoving&&o(ee({x:e.touches[0].pageX,y:e.touches[0].pageY}))}},a.createElement($.a.div,{className:n.layerContainer,style:{transform:c}},t),a.createElement("div",{className:n.controlInstruction},"Middle mouse click and drag to move camera, middle wheel to zoom"))};oe.defaultProps={};var ie=oe,ce=n(12),le=Object(N.a)({reducer:Object(ce.c)({camera:re,map:A})}),se=a.memo((function(e){var t=e.layerId,n=b({}),r=Object(z.c)((function(e){return e.map.layerDefs[t]}));return function(e){switch(r.type){case"image":return a.createElement(w,{className:n.layer,key:e,layerId:e,layerDef:r});case"object":return a.createElement(K,{className:n.layer,key:e,layerId:e,layerDef:r});default:return null}}(t)})),ue=a.memo((function(){var e=Object(z.c)((function(e){return e.map.layerOrder}));return a.createElement(a.Fragment,null,e.map((function(e){return a.createElement(se,{key:e,layerId:e})})))})),de=function(e){var t=b(e),n=(e.className,e.mapDef),r=Object(z.c)((function(e){return Boolean(e.map)})),o=Object(z.c)((function(e){var t;return Boolean(null===(t=e.map)||void 0===t?void 0:t.loaded)})),i=Object(z.b)();return a.useEffect((function(){r||i(L(n))}),[i,r,n]),o&&r?a.createElement("div",{className:t.root},a.createElement(ie,null,a.createElement(ue,null))):null},me=function(e){return a.createElement(z.a,{store:le},a.createElement(de,e))},fe=n(239),pe=n(52),be=n.n(pe),he=(n(53),n(238)),ge=n(54),ye={row:{justifyContent:"center"},column:{alignItems:"center"}},ve='Kanit, Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif',we='Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif',je={palette:{background:{},type:"dark",primary:he.a,secondary:ge.a},mixins:{flex:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"column",t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return Object(k.a)({display:"flex",flexDirection:e},n.includes("center")?ye[e]:{},{},n.includes("wrap")?{flexWrap:"wrap"}:{})},imageAvatar:function(){return{borderRadius:"12%"}},mixBackgroundColor:function(e,t){return{backgroundColor:t,color:e.palette.getContrastText(t)}}},drawer:{width:240},main:{width:720},sidebar:{width:300,flex:"0 0 300px"},typography:{fontSize:14,fontFamily:we,sansFonts:ve,serifFonts:we,h1:{fontFamily:ve},h2:{fontFamily:ve},h3:{fontFamily:ve},h4:{fontFamily:ve},h5:{fontFamily:ve},h6:{fontFamily:ve}}},Oe=be()(je),xe=n(240),Ee=n(102),ke=n(4),Ce=be()(Oe);var De=function(){return r.a.createElement(Ee.a,{basename:"/rpg-map"},r.a.createElement(fe.a,{theme:Ce},r.a.createElement(xe.a,null,r.a.createElement("div",{className:"App"},r.a.createElement(ke.c,null,r.a.createElement(ke.a,{path:"/demo1"},r.a.createElement(me,{mapDef:l.a})),r.a.createElement(ke.a,{path:"/demo2"},r.a.createElement(me,{mapDef:u.a})),r.a.createElement(ke.a,null,r.a.createElement(me,{mapDef:l.a})))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(De,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},69:function(e,t){e.exports={gridCount:{width:36,height:24},gridSize:{width:70,height:70},layerOrder:["imagelayer1","objectlayer1"],layerDefs:{imagelayer1:{type:"image",src:"/assets/map.png"},objectlayer1:{type:"object",walkable:[[1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],[0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1],[1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1],[1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}}}},99:function(e,t){e.exports={gridCount:{width:22,height:12},gridSize:{width:50,height:50},layerOrder:["imagelayer1","objectlayer1"],layerDefs:{imagelayer1:{type:"image",src:"/assets/demo2/map.png"},objectlayer1:{type:"object",walkable:{src:"/assets/demo2/walkabledef.png"}}},objectDefs:{hero1:{sprite:"hero1",layer:"objectlayer1",position:{x:4,y:3},stat:{movementRange:4}},hero2:{sprite:"hero1",layer:"objectlayer1",position:{x:6,y:4},stat:{movementRange:4}}},spriteDefs:{hero1:{type:"image",src:"/assets/demo2/hero1.png"}}}}},[[106,1,2]]]);
//# sourceMappingURL=main.b03edbc6.chunk.js.map