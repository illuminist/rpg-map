(this["webpackJsonprpg-map"]=this["webpackJsonprpg-map"]||[]).push([[0],{104:function(e,t,a){e.exports=a(224)},109:function(e,t,a){},224:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(95),i=a.n(o),l=(a(109),a(63)),c=a.n(l),s=a(96),u=a.n(s),m=a(47),d=a(19),f=a(97),h=a.n(f),p=a(239),g=function(e,t){return Object(p.a)(e,h()(t,"name"))},b=g((function(e){return{root:{height:"100vh",width:"100vw"},zoomController:{position:"absolute",height:"300vh"},layerContainer:{position:"fixed",top:0,left:0,height:"100vh",width:"100vw"},layer:{position:"absolute",top:0,left:0,userSelect:"none"},controllInstruction:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",backgroundColor:"rgba(0,0,0,0.3)",color:"white",borderTopRightRadius:e.shape.borderRadius,borderTopLeftRadius:e.shape.borderRadius,padding:16}}}),{name:"GameMap",index:1}),y=g((function(e){return{root:{}}}),{name:"ImageLayer",index:1}),v=function(e){return e&&e.startsWith("/")?"/rpg-map"+e:e},w=function(e){var t=y(e),a=e.className,r=e.layerId,o=e.layerDef;return n.createElement("div",{className:Object(d.a)(a,t.root)},n.createElement("img",{src:v(o.src),alt:r}))};w.defaultProps={};var E=w,C=a(13),x=a(64),k=a.n(x),j=a(98),z=a(33),O=a.n(z),D=g((function(e){return{root:{},tileSize:function(e){return{width:e.gridSize.width,height:e.gridSize.height}},tile:{backgroundColor:"rgba(255,0,0,0.3)",position:"absolute",borderStyle:"solid",borderColor:"rgba(255,0,0,0.3)",borderWidth:1},walkable:{backgroundColor:"unset",borderColor:"rgba(0,255,0,0.1)"}}}),{name:"ObjectLayer",index:1}),S=function(e,t){var a=n.useRef({deps:t,runningCount:0});a.current.deps=t,n.useEffect((function(){var n={isCurrent:!0,deps:t};return a.current.runningCount++,e(n,a.current).finally((function(){console.log("async fin"),a.current.runningCount--})),function(){n.isCurrent=!1}}),t)},M=function(e){var t=e.className,a=e.mapDef,r=e.layerDef,o=D(a),i=n.useState("src"in r.walkable?null:r.walkable),l=Object(m.a)(i,2),c=l[0],s=l[1];return S(function(){var e=Object(j.a)(k.a.mark((function e(t){var n;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:!c&&"src"in r.walkable&&((n=document.createElement("img")).src=v(r.walkable.src),n.onload=function(){if(t.isCurrent){var e=document.createElement("canvas");e.width=n.width,e.height=n.height;var r=e.getContext("2d");if(!r)throw new Error("not-support-canvas");r.drawImage(n,0,0,n.width,n.height);var o=O.a.times(a.gridCount.height,(function(e){return O.a.times(a.gridCount.width,(function(t){return r.getImageData(t*a.gridSize.width+a.gridSize.width/2,e*a.gridSize.height+a.gridSize.height/2,1,1).data[0]?0:1}))}));s(o)}});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[a,c,r.walkable]),c&&n.createElement("div",{className:Object(d.a)(t,o.root)},O.a.times(a.gridCount.height,(function(e){return O.a.times(a.gridCount.width,(function(t){var r;return n.createElement("div",{key:e+":"+t,style:{top:e*a.gridSize.height,left:t*a.gridSize.width},className:Object(d.a)(o.tile,o.tileSize,Object(C.a)({},o.walkable,null===(r=c[e])||void 0===r?void 0:r[t]))})}))})))};M.defaultProps={};var N=M,F=a(25),I=a(68),R={isMoving:!1,position:{x:0,y:0},zoom:1},L=Object(F.a)("cameramovestart"),A=Object(F.a)("cameramovezoomrelative"),P=Object(F.a)("cameramoverelative"),W=Object(F.a)("cameramoveend"),B=Object(F.b)(R,(function(e){return e.addCase(L,(function(e,t){e.isMoving=!0})).addCase(W,(function(e,t){e.isMoving=!1})).addCase(P,(function(e,t){e.position.x+=t.payload.x,e.position.y+=t.payload.y})).addCase(A,(function(e,t){e.zoom=Math.min(8,Math.max(.1,e.zoom+t.payload))}))})),T=n.memo((function(e){var t=e.mapDef,a=b(t);return n.createElement(n.Fragment,null,t.layerOrder.map((function(e){return function(e,r){switch(r.type){case"image":return n.createElement(E,{className:a.layer,key:e,layerId:e,layerDef:r,mapDef:t});case"object":return n.createElement(N,{className:a.layer,key:e,layerId:e,layerDef:r,mapDef:t});default:return null}}(e,t.layerDefs[e])})))})),H=function(e){var t=b(e),a=e.className,r=e.mapDef,o=n.useReducer(B,R),i=Object(m.a)(o,2),l=i[0],c=i[1];n.useEffect((function(){var e=function(e){1===e.button&&c(W())},t=function(e){c(A(-e.deltaY/200))};return window.addEventListener("mouseup",e),window.addEventListener("wheel",t),function(){window.removeEventListener("mouseup",e),window.removeEventListener("wheel",t)}}),[]);var s=Object(I.b)({zoom:l.zoom});return n.createElement("div",{className:Object(d.a)(a,t.root),onMouseDown:function(e){1===e.button&&c(L())},onMouseMove:function(e){l.isMoving&&c(P({x:e.movementX,y:e.movementY}))}},n.createElement(I.a.div,{className:t.layerContainer,style:{transform:s.zoom.interpolate((function(e){return"translate(".concat(l.position.x,"px,").concat(l.position.y,"px) scale(").concat(e,")")}))}},n.createElement(T,{mapDef:r})),n.createElement("div",{className:t.controllInstruction},"Middle mouse click and drag to move camera, middle wheel to zoom"))};H.defaultProps={};var J=H,X=a(237),Y=a(45),G=a.n(Y),K=a(100),$=(a(48),a(236)),q=a(49),Q={row:{justifyContent:"center"},column:{alignItems:"center"}},U='Kanit, Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif',V='Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif',Z={palette:{background:{},type:"dark",primary:$.a,secondary:q.a},mixins:{flex:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"column",t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];return Object(K.a)({display:"flex",flexDirection:e},a.includes("center")?Q[e]:{},{},a.includes("wrap")?{flexWrap:"wrap"}:{})},imageAvatar:function(){return{borderRadius:"12%"}},mixBackgroundColor:function(e,t){return{backgroundColor:t,color:e.palette.getContrastText(t)}}},drawer:{width:240},main:{width:720},sidebar:{width:300,flex:"0 0 300px"},typography:{fontSize:14,fontFamily:V,sansFonts:U,serifFonts:V,h1:{fontFamily:U},h2:{fontFamily:U},h3:{fontFamily:U},h4:{fontFamily:U},h5:{fontFamily:U},h6:{fontFamily:U}}},_=G()(Z),ee=a(238),te=a(101),ae=a(3),ne=G()(_);var re=function(){return r.a.createElement(te.a,null,r.a.createElement(X.a,{theme:ne},r.a.createElement(ee.a,null,r.a.createElement("div",{className:"App"},r.a.createElement(ae.c,null,r.a.createElement(ae.a,{path:"/demo1"},r.a.createElement(J,{mapDef:c.a})),r.a.createElement(ae.a,{path:"/demo2"},r.a.createElement(J,{mapDef:u.a})),r.a.createElement(ae.a,null,r.a.createElement(J,{mapDef:c.a})))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(re,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},63:function(e,t){e.exports={gridCount:{width:36,height:24},gridSize:{width:70,height:70},layerOrder:["imagelayer1","objectlayer1"],layerDefs:{imagelayer1:{type:"image",src:"/assets/map.png"},objectlayer1:{type:"object",walkable:[[1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],[0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,1,1,0,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1],[1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1],[1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}}}},96:function(e,t){e.exports={gridCount:{width:22,height:12},gridSize:{width:50,height:50},layerOrder:["imagelayer1","objectlayer1"],layerDefs:{imagelayer1:{type:"image",src:"/assets/demo2/map.png"},objectlayer1:{type:"object",walkable:{src:"/assets/demo2/walkabledef.png"}}}}}},[[104,1,2]]]);
//# sourceMappingURL=main.2bd292d0.chunk.js.map