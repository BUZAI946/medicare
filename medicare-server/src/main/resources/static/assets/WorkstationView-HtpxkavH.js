import{d as oe,o as se,c as g,e as a,w as t,h as s,g as x,j as f,a as l,b as P,F as T,r as W,s as p,t as v,x as de,p as z,v as B,n as S,A as q,z as re,E as y,K as ce}from"./index-B8y5P8gE.js";import{l as ue}from"./doctor-vBfTdRid.js";import{l as me,a as pe,b as ve}from"./registration-i0B3BSbR.js";import{c as fe}from"./medical-record-D4zYyin-.js";import{w as D}from"./images-BsWFzSwZ.js";import{_ as be}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./index-DCqT4Hme.js";const ge={class:"workstation"},ye=["src"],_e=["src"],he={class:"ai-header"},ke={class:"ai-title"},xe={class:"ai-header-right"},we={class:"ai-body"},Ce={class:"ai-quick-tags"},Ie={class:"ai-input-row"},Ve={key:0,class:"ai-thinking"},Re={key:1,class:"ai-result"},Ae={class:"sev-bar"},Ne={class:"ai-section"},Te={class:"ai-diagnosis-cards"},We={class:"diag-name"},ze={class:"diag-prob"},Be={class:"prob-bar"},Se={class:"ai-section"},qe={class:"ai-med-list"},Ee={key:0,class:"ai-drug-warn"},Le={class:"ai-section"},Pe={class:"ai-exam-list"},De={class:"ai-section"},Me={class:"ai-advice"},Ue={style:{"margin-bottom":"12px"}},Fe={style:{"margin-top":"12px",display:"flex",gap:"8px"}},He=oe({__name:"WorkstationView",setup($e){const E=x([]),C=x(),L=x([]),i=x(null),d=re({chiefComplaint:"",presentIllness:"",pastHistory:"",physicalExam:"",diagnosis:"",advice:""}),_=x(""),b=x(!1),o=x(null),M=["头痛","发热","咳嗽","腹痛","头晕","过敏","胸闷","乏力","恶心"],U={头痛:{severity:45,level:"mid",diagnoses:[{name:"紧张性头痛",probability:55,color:"#e6a23c"},{name:"偏头痛",probability:25,color:"#f56c6c"},{name:"颈椎病",probability:12,color:"#409eff"},{name:"高血压相关",probability:8,color:"#f56c6c"}],medication:`轻中度：布洛芬缓释胶囊 1粒/次 PRN
重度/偏头痛：佐米曲普坦 2.5mg 发作时服
紧张性：乙哌立松 50mg tid`,examination:`血压测量（必查）
神经系统查体
必要时头颅CT/MRI`,advice:`记录头痛日记（频率/诱因/程度）
避免诱因：熬夜、咖啡、酒精
若每周发作>2次需预防用药
1周后复诊评估`,drugWarnings:`布洛芬+阿司匹林→增加胃出血风险
布洛芬+华法林→增加出血风险`},发热:{severity:55,level:"mid",diagnoses:[{name:"上呼吸道感染",probability:60,color:"#e6a23c"},{name:"流行性感冒",probability:20,color:"#f56c6c"},{name:"细菌性感染",probability:12,color:"#f56c6c"},{name:"新冠病毒感染",probability:8,color:"#f56c6c"}],medication:`体温<38.5°C：物理降温+多饮水
体温≥38.5°C：对乙酰氨基酚 0.5g PRN（间隔≥4h）
流感确诊：奥司他韦 75mg bid×5天`,examination:`血常规+CRP（必查）
流感/新冠抗原检测
降钙素原（鉴别细菌感染）`,advice:`每4小时监测体温并记录
大量饮水（>2000ml/天）
持续高热>3天或体温>40°C立即复诊
注意室内通风、佩戴口罩`,drugWarnings:`对乙酰氨基酚+酒精→肝损伤风险
避免多种复方感冒药同时服用`},咳嗽:{severity:40,level:"mid",diagnoses:[{name:"急性支气管炎",probability:50,color:"#e6a23c"},{name:"上呼吸道感染",probability:25,color:"#409eff"},{name:"过敏性咳嗽",probability:15,color:"#409eff"},{name:"咳嗽变异性哮喘",probability:10,color:"#f56c6c"}],medication:`干咳：右美沙芬 15mg tid
有痰：氨溴索 30mg tid+乙酰半胱氨酸
伴喘息：沙丁胺醇吸入剂 PRN
过敏性：氯雷他定 10mg qd`,examination:`胸部X光（咳嗽>2周必查）
肺功能检测
过敏原筛查`,advice:`戒烟戒酒，避免刺激性气体
夜间咳嗽加重→加高枕头
咳嗽>4周需进一步检查排查哮喘
痰中带血立即就医`,drugWarnings:`右美沙芬+氟西汀→5-羟色胺综合征风险
多种止咳药勿联用`},腹痛:{severity:60,level:"high",diagnoses:[{name:"急性胃肠炎",probability:45,color:"#e6a23c"},{name:"功能性消化不良",probability:25,color:"#409eff"},{name:"阑尾炎",probability:18,color:"#f56c6c"},{name:"胆囊炎/胆结石",probability:12,color:"#f56c6c"}],medication:`胃肠炎：蒙脱石散 3g tid+口服补液盐
痉挛痛：山莨菪碱 10mg IM PRN
抑酸：奥美拉唑 20mg qd（胃痛为主）
⚠ 未明确诊断前禁用止痛药！`,examination:`腹部B超（必查）
血常规+CRP
尿常规（排除泌尿系结石）
必要时腹部CT`,advice:`⚠ 右下腹固定压痛+反跳痛→高度怀疑阑尾炎→立即转外科
禁食禁水至明确诊断
记录疼痛位置/性质/持续时间
老年人注意排除心梗（上腹痛）`,drugWarnings:`⚠ 未确诊前禁用吗啡类止痛药（掩盖症状）
布洛芬可能加重消化道症状`},头晕:{severity:35,level:"mid",diagnoses:[{name:"良性位置性眩晕",probability:40,color:"#409eff"},{name:"贫血",probability:25,color:"#e6a23c"},{name:"颈椎病",probability:20,color:"#409eff"},{name:"脑血管供血不足",probability:15,color:"#f56c6c"}],medication:`眩晕：倍他司汀 6mg tid
贫血：根据类型补充铁剂/B12/叶酸
颈椎病：乙哌立松 50mg tid+理疗`,examination:`血常规（排除贫血）
颈椎X光/MRI
前庭功能检查
TCD脑血管超声
体位性血压测量`,advice:`眩晕发作时卧床休息防跌倒
耳石症→手法复位治疗
老年人需测卧立位血压
合并言语不清/肢体麻木→立即CT排除卒中`,drugWarnings:"倍他司汀+抗组胺药→可能增强镇静作用"},过敏:{severity:50,level:"high",diagnoses:[{name:"荨麻疹",probability:55,color:"#e6a23c"},{name:"过敏性皮炎",probability:25,color:"#409eff"},{name:"药物过敏",probability:15,color:"#f56c6c"},{name:"过敏性休克前兆",probability:5,color:"#f56c6c"}],medication:`轻中度：氯雷他定 10mg qd+炉甘石洗剂外用
重度：泼尼松 30mg qd×3天（短期）
⚠ 喉头水肿→肾上腺素 0.3mg IM 立即！`,examination:`过敏原检测（皮肤点刺/IgE）
血常规（嗜酸性粒细胞）
严重者：血清总IgE`,advice:`⚠ 出现呼吸困难/喉头堵塞感→立即急救！
详细记录接触史（食物/药物/环境）
避免已知过敏原
建议随身携带抗过敏药`,drugWarnings:`氯雷他定+酮康唑→可能增加氯雷他定血药浓度
多种抗组胺药勿叠加使用`},胸闷:{severity:65,level:"high",diagnoses:[{name:"冠心病/心绞痛",probability:35,color:"#f56c6c"},{name:"焦虑/心脏神经症",probability:30,color:"#409eff"},{name:"支气管哮喘",probability:20,color:"#e6a23c"},{name:"胃食管反流",probability:15,color:"#409eff"}],medication:`心绞痛：硝酸甘油 0.5mg 舌下含服（诊断性治疗）
哮喘：沙丁胺醇吸入剂 PRN
反流：奥美拉唑 20mg bid`,examination:`心电图（必查！）
心肌酶谱+肌钙蛋白
胸部X光
必要时冠脉CTA
24h动态心电图`,advice:`⚠ 胸痛持续>20分钟→立即急诊排除心梗！
戒烟+控制血压/血脂/血糖
避免剧烈运动至明确诊断
记录胸痛诱因/性质/持续时间`,drugWarnings:`硝酸甘油+西地那非（伟哥）→致命性低血压
多种降压药可能加重症状`},乏力:{severity:30,level:"mid",diagnoses:[{name:"亚健康/睡眠不足",probability:40,color:"#409eff"},{name:"贫血",probability:28,color:"#e6a23c"},{name:"甲状腺功能减退",probability:18,color:"#409eff"},{name:"慢性疲劳综合征",probability:14,color:"#e6a23c"}],medication:`贫血→根据类型补铁/B12
甲减→左甲状腺素钠（需确诊后）
一般：复合维生素B族+辅酶Q10`,examination:`血常规+铁蛋白
甲状腺功能（TSH/FT3/FT4）
血糖+糖化血红蛋白
必要时睡眠监测`,advice:`保证7-8小时睡眠
适度有氧运动（每周150分钟）
均衡饮食+足量蛋白质
持续>2周需进一步检查`,drugWarnings:`铁剂+左甲状腺素→间隔4小时服用
铁剂+茶/咖啡→影响吸收`},恶心:{severity:35,level:"mid",diagnoses:[{name:"急性胃炎",probability:45,color:"#e6a23c"},{name:"妊娠反应",probability:25,color:"#409eff"},{name:"药物不良反应",probability:18,color:"#e6a23c"},{name:"前庭功能障碍",probability:12,color:"#409eff"}],medication:`甲氧氯普胺 10mg tid PRN
维生素B6 20mg tid
妊娠：首选B6+多西拉敏`,examination:`育龄女性→尿HCG（必查）
腹部B超
胃镜（持续>2周）
用药史详细询问`,advice:`少量多餐，避免油腻
生姜茶可缓解轻度恶心
持续呕吐→注意电解质紊乱
育龄女性首先排除妊娠`,drugWarnings:`甲氧氯普胺+抗精神病药→锥体外系反应风险
长期使用甲氧氯普胺不超过12周`}};function V(){if(!_.value.trim()){y.warning("请输入症状描述");return}b.value=!0,o.value=null,setTimeout(()=>{const r=_.value.toLowerCase();let e=[];for(const[u,m]of Object.entries(U))r.includes(u)&&e.push({key:u,...m,matchLen:u.length});e.sort((u,m)=>m.matchLen-u.matchLen);let c;if(e.length>0){const u=e[0];let m=u.severity;e.length>1&&(m=Math.min(m+e.length*8,95)),c={...u,severity:m,level:m>=60?"high":m>=35?"mid":"low"}}else c={severity:25,level:"low",diagnoses:[{name:"症状信息不足",probability:60,color:"#909399"},{name:"建议进一步问诊",probability:40,color:"#409eff"}],medication:"请详细描述症状（部位、性质、持续时间、诱因、伴随症状）后重新分析",examination:"建议完成基础查体：血压、心率、体温、呼吸频率",advice:`建议按照SOCRATES框架描述症状：
S-部位 O-性质 C-时间 R-放射 A-伴随 T-时间 E-加重/缓解因素
详细问诊后再行AI分析`,drugWarnings:""};o.value=c,b.value=!1,c.level==="high"?y.warning("⚠ 检测到高风险症状，请优先关注！"):y.success("AI 深度分析完成")},1200)}function F(r){_.value=r,V()}function H(){if(!i.value){y.warning("请先选择患者");return}const r=i.value.patientName;_.value=`${r?r+" ":""}主诉不适`,ce(()=>{const e=document.querySelector(".ai-input-row .el-input__inner");e==null||e.focus()})}function $(){var e,c,u;if(!o.value)return;const r=((c=(e=o.value.diagnoses)==null?void 0:e[0])==null?void 0:c.name)||"";d.diagnosis=r,d.advice=((u=o.value.medication)==null?void 0:u.split(`
`)[0])||"",y.success("已填入诊断和首选用药方案")}async function j(){try{const r=await ue();E.value=r.data}catch{}}async function R(){if(C.value)try{const r=await me(void 0,void 0);L.value=r.data.filter(e=>e.doctorId===C.value&&(e.status===0||e.status===1))}catch{}}function K(r){i.value=r}async function O(){if(i.value)try{await pe(i.value.id),y.success("叫号成功"),R()}catch{}}async function X(){if(i.value)try{await ve(i.value.id),y.success("就诊完成"),i.value=null,R()}catch{}}async function G(){if(i.value)try{await fe({registrationId:i.value.id,patientId:i.value.patientId,doctorId:i.value.doctorId||C.value,...d}),y.success("病历保存成功")}catch{}}return se(j),(r,e)=>{const c=s("el-col"),u=s("el-row"),m=s("el-tag"),w=s("el-button"),h=s("el-input"),A=s("el-card"),Q=s("Stethoscope"),I=s("el-icon"),J=s("el-option"),Y=s("el-select"),N=s("el-table-column"),Z=s("el-table"),ee=s("Bell"),ae=s("Check"),le=s("Cpu"),k=s("el-form-item"),te=s("DocumentAdd"),ne=s("el-form"),ie=s("el-empty");return f(),g("div",ge,[a(u,{gutter:16,style:{"margin-bottom":"16px"}},{default:t(()=>[a(c,{span:8},{default:t(()=>[l("img",{src:P(D)[0],class:"hero-img",alt:"医生"},null,8,ye)]),_:1}),a(c,{span:8},{default:t(()=>[l("img",{src:P(D)[1],class:"hero-img",alt:"诊疗"},null,8,_e)]),_:1}),a(c,{span:8},{default:t(()=>[...e[8]||(e[8]=[l("div",{style:{background:"linear-gradient(135deg,#667eea,#764ba2)","border-radius":"12px",padding:"18px 20px",color:"#fff","aspect-ratio":"16/9",display:"flex","flex-direction":"column","justify-content":"center"}},[l("div",{style:{"font-size":"22px","font-weight":"bold","margin-bottom":"6px"}},"🩺 智能工作站"),l("div",{style:{"font-size":"13px",opacity:"0.85"}},"AI智能问诊辅助系统 · 8种症状覆盖")],-1)])]),_:1})]),_:1}),a(A,{class:"ai-panel",shadow:"hover"},{header:t(()=>[l("div",he,[l("span",ke,[l("span",{class:z(["ai-brain-icon",{thinking:b.value}])},"🧠",2),e[9]||(e[9]=p(" AI 智能辅助诊断系统 ",-1))]),l("div",xe,[e[11]||(e[11]=l("span",{class:"ai-pulse"},null,-1)),a(m,{type:"danger",size:"small",effect:"dark"},{default:t(()=>[...e[10]||(e[10]=[p("DeepThink v2.0",-1)])]),_:1})])])]),default:t(()=>[l("div",we,[l("div",Ce,[e[12]||(e[12]=l("span",{class:"quick-label"},"常见症状：",-1)),(f(),g(T,null,W(M,n=>a(m,{key:n,size:"small",class:"symptom-tag",onClick:je=>F(n),effect:_.value===n?"dark":"plain"},{default:t(()=>[p(v(n),1)]),_:2},1032,["onClick","effect"])),64))]),l("div",Ie,[a(h,{modelValue:_.value,"onUpdate:modelValue":e[0]||(e[0]=n=>_.value=n),placeholder:"输入症状描述，AI深度分析…（支持多症状组合：如 头痛+发热+乏力）",onKeyup:de(V,["enter"]),clearable:"",size:"large",disabled:b.value},{prefix:t(()=>[l("span",{class:z(["ai-input-icon",{spinning:b.value}])},"🧬",2)]),append:t(()=>[a(w,{type:"primary",onClick:V,loading:b.value,class:"ai-analyze-btn"},{default:t(()=>[p(v(b.value?"分析中…":"🔍 深度分析"),1)]),_:1},8,["loading"])]),_:1},8,["modelValue","disabled"])]),b.value?(f(),g("div",Ve,[...e[13]||(e[13]=[l("div",{class:"think-dots"},[l("span"),l("span"),l("span")],-1),l("span",null,"AI 正在分析症状，检索知识库…",-1)])])):B("",!0),o.value&&!b.value?(f(),g("div",Re,[l("div",{class:z(["ai-severity",o.value.level])},[l("div",Ae,[l("div",{class:"sev-fill",style:S({width:o.value.severity+"%"})},null,4)]),l("span",null,"严重程度："+v(o.value.severity)+"%",1),a(m,{type:o.value.level==="high"?"danger":o.value.level==="mid"?"warning":"success",size:"small"},{default:t(()=>[p(v(o.value.level==="high"?"⚠ 高度关注":o.value.level==="mid"?"⚡ 中等风险":"✅ 较低风险"),1)]),_:1},8,["type"])],2),l("div",Ne,[e[14]||(e[14]=l("div",{class:"ai-label"},"🎯 疑似诊断",-1)),l("div",Te,[(f(!0),g(T,null,W(o.value.diagnoses,n=>(f(),g("div",{key:n.name,class:"diag-card",style:S({borderLeftColor:n.color})},[l("div",We,v(n.name),1),l("div",ze,[l("div",Be,[l("div",{class:"prob-fill",style:S({width:n.probability+"%",background:n.color})},null,4)]),l("span",null,v(n.probability)+"%",1)])],4))),128))])]),l("div",Se,[e[15]||(e[15]=l("div",{class:"ai-label"},"💊 推荐用药方案",-1)),l("div",qe,v(o.value.medication),1),o.value.drugWarnings?(f(),g("div",Ee," ⚠️ 药物相互作用提醒："+v(o.value.drugWarnings),1)):B("",!0)]),l("div",Le,[e[16]||(e[16]=l("div",{class:"ai-label"},"🔬 建议检查项目",-1)),l("div",Pe,v(o.value.examination),1)]),l("div",De,[e[17]||(e[17]=l("div",{class:"ai-label"},"📋 临床建议与随访",-1)),l("div",Me,v(o.value.advice),1)]),e[18]||(e[18]=l("div",{class:"ai-disclaimer"},"⚠ AI分析仅供参考，最终诊断需医师结合临床判断",-1))])):B("",!0)])]),_:1}),a(A,{class:"workstation-card",style:{"margin-top":"16px"}},{header:t(()=>[l("span",null,[a(I,null,{default:t(()=>[a(Q)]),_:1}),e[19]||(e[19]=p(" 医生工作站",-1))])]),default:t(()=>[a(u,{gutter:20},{default:t(()=>[a(c,{span:10},{default:t(()=>[l("div",Ue,[a(Y,{modelValue:C.value,"onUpdate:modelValue":e[1]||(e[1]=n=>C.value=n),placeholder:"选择医生",style:{width:"100%"},onChange:R},{default:t(()=>[(f(!0),g(T,null,W(E.value,n=>(f(),q(J,{key:n.id,label:`${n.name} - ${n.departmentName}`,value:n.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),a(Z,{data:L.value,stripe:"",border:"",onRowClick:K,"highlight-current-row":"",style:{width:"100%"},"max-height":"350"},{default:t(()=>[a(N,{prop:"seqNo",label:"序号",width:"60"}),a(N,{prop:"patientName",label:"患者"}),a(N,{prop:"status",label:"状态",width:"90"},{default:t(({row:n})=>[a(m,{type:n.status===0?"warning":n.status===1?"":"success"},{default:t(()=>[p(v(["候诊","就诊中","已完成","已取消"][n.status]),1)]),_:2},1032,["type"])]),_:1})]),_:1},8,["data"]),l("div",Fe,[a(w,{type:"primary",disabled:!i.value||i.value.status!==0,onClick:O},{default:t(()=>[a(I,null,{default:t(()=>[a(ee)]),_:1}),e[20]||(e[20]=p(" 叫号 ",-1))]),_:1},8,["disabled"]),a(w,{type:"success",disabled:!i.value||i.value.status!==1,onClick:X},{default:t(()=>[a(I,null,{default:t(()=>[a(ae)]),_:1}),e[21]||(e[21]=p(" 完成就诊 ",-1))]),_:1},8,["disabled"]),a(w,{disabled:!i.value,onClick:H},{default:t(()=>[a(I,null,{default:t(()=>[a(le)]),_:1}),e[22]||(e[22]=p(" 智能分析 ",-1))]),_:1},8,["disabled"])])]),_:1}),a(c,{span:14},{default:t(()=>[i.value&&i.value.status===1?(f(),q(A,{key:0,class:"record-card"},{header:t(()=>[p("📋 病历书写 — "+v(i.value.patientName),1)]),default:t(()=>[a(ne,{ref:"recordFormRef",model:d,"label-width":"90px",size:"default"},{default:t(()=>[a(u,{gutter:12},{default:t(()=>[a(c,{span:12},{default:t(()=>[a(k,{label:"主诉"},{default:t(()=>[a(h,{modelValue:d.chiefComplaint,"onUpdate:modelValue":e[2]||(e[2]=n=>d.chiefComplaint=n),type:"textarea",rows:2},null,8,["modelValue"])]),_:1})]),_:1}),a(c,{span:12},{default:t(()=>[a(k,{label:"诊断"},{default:t(()=>[a(h,{modelValue:d.diagnosis,"onUpdate:modelValue":e[3]||(e[3]=n=>d.diagnosis=n)},null,8,["modelValue"])]),_:1}),a(k,{label:"体格检查"},{default:t(()=>[a(h,{modelValue:d.physicalExam,"onUpdate:modelValue":e[4]||(e[4]=n=>d.physicalExam=n)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(k,{label:"现病史"},{default:t(()=>[a(h,{modelValue:d.presentIllness,"onUpdate:modelValue":e[5]||(e[5]=n=>d.presentIllness=n),type:"textarea",rows:2},null,8,["modelValue"])]),_:1}),a(k,{label:"既往史"},{default:t(()=>[a(h,{modelValue:d.pastHistory,"onUpdate:modelValue":e[6]||(e[6]=n=>d.pastHistory=n)},null,8,["modelValue"])]),_:1}),a(k,{label:"医嘱"},{default:t(()=>[a(h,{modelValue:d.advice,"onUpdate:modelValue":e[7]||(e[7]=n=>d.advice=n),type:"textarea",rows:2},null,8,["modelValue"])]),_:1}),a(k,null,{default:t(()=>[a(w,{type:"primary",onClick:G,size:"large"},{default:t(()=>[a(I,null,{default:t(()=>[a(te)]),_:1}),e[23]||(e[23]=p(" 保存病历 ",-1))]),_:1}),a(w,{onClick:$,disabled:!o.value},{default:t(()=>[...e[24]||(e[24]=[p("从AI助手填入",-1)])]),_:1},8,["disabled"])]),_:1})]),_:1},8,["model"])]),_:1})):(f(),q(ie,{key:1,description:"请先选择患者并叫号进入就诊",class:"empty-hint"}))]),_:1})]),_:1})]),_:1})])}}}),Ze=be(He,[["__scopeId","data-v-6450b9cb"]]);export{Ze as default};
