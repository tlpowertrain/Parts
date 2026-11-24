/* TL Powertrain quote list.
   Modes:
   - normal  : a parts-site page opened directly (part pages, lookup) -> dock bottom-right of the page.
   - embed   : the lookup inside tlpowertrain.com -> no dock here (the site-wide dock shows it);
               reports page height so the GoDaddy page has a single scroll bar.
   - dock    : dock.html, loaded by tlpowertrain.com on every page -> only the dock, sized to fit. */
(function(){
  var KEY='tlq_cart', OPEN='tlq_open', EMAIL='sales@tlpowertrain.com', mem=[];
  var DOCK=!!window.TL_DOCK, EMBED=!DOCK&&window.self!==window.top;
  var ALWAYS=!DOCK||/[?&]always=1/.test(location.search);
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return mem}}
  function save(c){mem=c;try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}}
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function count(){return load().length}
  var root=document.documentElement;

  var css=
  ':root{--vt:0px;--vh:100vh;--vb:0px}'+
  '.qc-dock{position:fixed;right:16px;bottom:calc(var(--vb) + 16px);z-index:60;width:340px;max-width:calc(100% - 32px);font:15px/1.45 Inter,Arial,sans-serif;color:#232a3d;box-shadow:0 6px 24px rgba(20,26,45,.25);border-radius:12px;background:#fff;overflow:hidden}'+
  '.qc-bar{display:flex;align-items:center;gap:10px;width:100%;background:#1f2f6b;color:#fff;border:0;padding:12px 16px;font:600 15px Inter,Arial,sans-serif;cursor:pointer;text-align:left;margin:0;border-radius:0}'+
  '.qc-bar:hover{background:#18265a}.qc-bar .c{background:#f26a0a;color:#fff;border-radius:999px;min-width:24px;padding:1px 8px;font-size:13px;text-align:center}'+
  '.qc-bar .l{flex:1}.qc-bar .ar{font-size:13px;transition:transform .15s}.qc-dock.open .qc-bar .ar{transform:rotate(180deg)}'+
  '.qc-dock.bump .qc-bar{animation:qcb .5s}@keyframes qcb{0%,100%{background:#1f2f6b}40%{background:#f26a0a}}'+
  '.qc-pan{display:none;flex-direction:column;max-height:calc(var(--vh) - 110px);min-height:0}.qc-dock.open .qc-pan{display:flex}'+
  '.qc-bd{flex:1;min-height:0;overflow:auto;padding:6px 16px 10px;overscroll-behavior:contain}'+
  '.qc-it{display:flex;gap:10px;align-items:center;border-bottom:1px solid #eef0f4;padding:9px 0}'+
  '.qc-it .t{flex:1;min-width:0}.qc-it .p{font-weight:700;color:#1f2f6b;word-break:break-word}.qc-it .n{font-size:13px;color:#5d6475}'+
  '.qc-it input{width:56px;padding:5px;border:1px solid #c9ced8;border-radius:6px;font:inherit;text-align:center}'+
  '.qc-it .rm{background:none;border:0;color:#b33;cursor:pointer;font-size:18px;padding:2px 6px}'+
  '.qc-add{display:flex;gap:8px;margin:10px 0}.qc-add input{flex:1;min-width:0;padding:8px 10px;border:1px solid #c9ced8;border-radius:8px;font:inherit}'+
  '.qc-add button{width:auto;background:#1f2f6b;color:#fff;border:0;border-radius:8px;padding:8px 14px;font:600 14px Inter,Arial,sans-serif;cursor:pointer}'+
  '.qc-f{display:block!important;max-width:none;margin:0}.qc-f label{display:block;font-size:13px;font-weight:600;margin:8px 0 3px;color:#1f2f6b}'+
  '.qc-f input,.qc-f textarea{width:100%;padding:8px 10px;border:1px solid #c9ced8;border-radius:8px;font:inherit;box-sizing:border-box}'+
  '.qc-f textarea{min-height:56px;resize:vertical}.qc-ft{padding:12px 16px;border-top:1px solid #e3e6ee}'+
  '.qc-send{width:100%!important;background:#f26a0a;color:#fff;border:0;border-radius:8px;padding:12px;font:600 16px Inter,Arial,sans-serif;cursor:pointer}.qc-send:hover{background:#d95c05}'+
  '.qc-empty{color:#5d6475;text-align:center;margin:16px 0 6px;font-size:14px}.qc-msg{font-size:13px;color:#5d6475;margin:8px 0 0;text-align:center}'+
  '.qc-ok{text-align:center;padding:24px 6px}.qc-ok h3{color:#1d7a46;margin:0 0 8px}'+
  '.qc-toast{position:fixed;left:50%;top:calc(var(--vt) + 20px);transform:translateX(-50%);background:#1f2f6b;color:#fff;padding:10px 16px;border-radius:8px;z-index:80;font:500 14px Inter,Arial,sans-serif;display:none}'+
  '.modal{top:var(--vt)!important;bottom:auto!important;height:var(--vh)!important}.box{max-height:calc(var(--vh) - 32px)!important}'+
  '@media (max-width:520px){.qc-dock{right:8px;max-width:calc(100% - 16px);bottom:calc(var(--vb) + 8px)}}'+
  (DOCK?'html,body{background:transparent!important;margin:0;overflow:hidden}.qc-dock{right:10px;bottom:10px;max-width:calc(100% - 20px);box-shadow:0 4px 14px rgba(20,26,45,.28)}':'');
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var toast=document.createElement('div');toast.className='qc-toast';document.body.appendChild(toast);
  function msg(t){toast.textContent=t;toast.style.display='block';clearTimeout(toast._t);toast._t=setTimeout(function(){toast.style.display='none'},2200)}
  function pageWidgets(){var n=count();document.querySelectorAll('[data-qc]').forEach(function(e){e.textContent=n});document.querySelectorAll('[data-qwrap]').forEach(function(e){e.style.display=n?'':'none'})}

  var dock=null,bar,pan,sent=false;
  if(!EMBED){
    dock=document.createElement('div');dock.className='qc-dock';
    dock.innerHTML='<button class="qc-bar" type="button" aria-expanded="false"><span class="l">Your quote list</span><span class="c">0</span><span class="ar">&#9650;</span></button><div class="qc-pan" role="region" aria-label="Quote list"></div>';
    bar=dock.querySelector('.qc-bar');pan=dock.querySelector('.qc-pan');
    document.body.appendChild(dock);
    bar.onclick=function(){isOpen()?close():open()};
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen())close()});
  }
  function isOpen(){return dock&&dock.classList.contains('open')}
  function refresh(){
    pageWidgets();if(!dock)return;
    var n=count();bar.querySelector('.c').textContent=n;
    dock.style.display=(ALWAYS||n||sent)?'':'none';
    if(DOCK)report();
  }
  function bump(){if(!dock)return;dock.classList.remove('bump');void dock.offsetWidth;dock.classList.add('bump')}
  function open(){
    if(!dock){try{localStorage.setItem(OPEN,String(Date.now()))}catch(e){}return}
    if(sent&&count())sent=false;if(!sent)render();dock.classList.add('open');bar.setAttribute('aria-expanded','true');refresh();
  }
  function close(){if(!dock)return;dock.classList.remove('open');bar.setAttribute('aria-expanded','false');sent=false;refresh()}

  function add(pn,name){
    pn=String(pn||'').trim();if(!pn)return;
    var c=load(),f=c.find(function(x){return x.pn.toUpperCase()===pn.toUpperCase()});
    if(f){f.qty=(parseInt(f.qty,10)||1)+1}else{c.push({pn:pn,name:name||'',qty:1})}
    save(c);sent=false;refresh();if(isOpen())render();bump();
    if(!DOCK)msg('Added '+pn+' to your quote list');
  }
  window.tlAddToQuote=add;window.tlOpenQuote=open;

  function render(){
    if(!dock)return;
    var c=load(),items=c.length?c.map(function(x,i){return '<div class="qc-it"><div class="t"><div class="p">'+esc(x.pn)+'</div><div class="n">'+esc(x.name)+'</div></div><input type="number" min="1" value="'+esc(x.qty)+'" data-i="'+i+'" aria-label="Quantity"><button class="rm" type="button" data-r="'+i+'" title="Remove" aria-label="Remove">&times;</button></div>'}).join(''):'<p class="qc-empty">Your quote list is empty. Search for a part and click "Add to quote".</p>';
    pan.innerHTML='<div class="qc-bd">'+items+
    '<div class="qc-add"><input id="qc-pn" placeholder="Add another part number"><button type="button" id="qc-ab">Add</button></div>'+
    (c.length?'<form class="qc-f" id="qc-form"><label>Name *</label><input name="name" required><label>Company *</label><input name="company" required>'+
    '<label>Email *</label><input name="email" type="email" required><label>Phone</label><input name="phone" type="tel">'+
    '<label>Notes (truck model, serial number, delivery location)</label><textarea name="notes"></textarea></form>':'')+'</div>'+
    (c.length?'<div class="qc-ft"><button class="qc-send" type="button" id="qc-send">Send quote request</button><p class="qc-msg">No prices or payment online. We reply with pricing within 24 hours.</p></div>':'');
    pan.querySelectorAll('input[data-i]').forEach(function(inp){inp.onchange=function(){var c=load();c[inp.dataset.i].qty=Math.max(1,parseInt(inp.value,10)||1);save(c)}});
    pan.querySelectorAll('[data-r]').forEach(function(b){b.onclick=function(){var c=load();c.splice(b.dataset.r,1);save(c);refresh();render()}});
    var pi=pan.querySelector('#qc-pn');pan.querySelector('#qc-ab').onclick=function(){if(pi.value.trim()){add(pi.value,'');pi.value=''}};
    pi.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();pan.querySelector('#qc-ab').click()}};
    var sb=pan.querySelector('#qc-send');if(sb)sb.onclick=submit;
    if(DOCK)report();
  }

  function submit(){
    var c=load(),f=pan.querySelector('#qc-form'),btn=pan.querySelector('#qc-send'),m=pan.querySelector('.qc-msg');
    if(!c.length){m.textContent='Please add at least one part.';return}
    if(!f.reportValidity())return;
    var d=new FormData(f),list=c.map(function(x){return x.pn+'  x '+x.qty+(x.name?'  ('+x.name+')':'')}).join('\n');
    var page=location.href;try{if(DOCK&&document.referrer)page=document.referrer}catch(e){}
    var body={_subject:'Quote request - '+(d.get('company')||d.get('name')||''),_template:'table',_captcha:'false',_replyto:d.get('email')||''};
    ['name','company','email','phone','notes'].forEach(function(k){body[k]=d.get(k)||''});body.parts=list;body.page=page;
    btn.disabled=true;btn.textContent='Sending...';
    fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)}).then(function(r){
      if(!r.ok)throw new Error(r.status);return r.json()}).then(function(j){
      if(j&&j.success===false||j&&j.success==='false')throw new Error('fail');
      sent=true;save([]);refresh();
      pan.innerHTML='<div class="qc-bd"><div class="qc-ok"><h3>Thank you, your request was sent.</h3><p>We received your list of '+c.length+' part'+(c.length>1?'s':'')+' and will reply by email with pricing within 24 hours.</p></div></div><div class="qc-ft"><button class="qc-send" type="button">Close</button></div>';
      pan.querySelector('.qc-ft button').onclick=close;if(DOCK)report();
    }).catch(function(){
      btn.disabled=false;btn.textContent='Send quote request';
      var mt='mailto:'+EMAIL+'?subject='+encodeURIComponent('Quote request - '+(d.get('company')||''))+'&body='+encodeURIComponent('Hi TL Powertrain,\n\nPlease quote the following parts:\n\n'+list+'\n\nName: '+d.get('name')+'\nCompany: '+d.get('company')+'\nEmail: '+d.get('email')+'\nPhone: '+d.get('phone')+'\nNotes: '+d.get('notes')+'\n\nThank you');
      m.innerHTML='Could not send online. <a href="'+mt+'" target="_top">Click here to send it by email instead</a>.';
      if(DOCK)report();
    });
  }

  var lastN=count();
  window.addEventListener('storage',function(e){
    if(e.key===OPEN){if(dock)open();return}
    var n=count();if(n>lastN)bump();lastN=n;
    refresh();if(isOpen()&&!sent)render();
  });
  refresh();

  /* ---- dock.html: tell the page how big the dock is ---- */
  var lastSize='';
  function report(){
    if(!DOCK)return;
    var vis=dock.style.display!=='none',h=vis?Math.ceil(dock.getBoundingClientRect().height)+20:0;
    var s=h+'|'+(isOpen()?1:0);if(s===lastSize)return;lastSize=s;
    try{parent.postMessage({tl:'d',h:h,open:isOpen()},'*')}catch(e){}
  }
  if(DOCK){
    if(window.ResizeObserver)new ResizeObserver(report).observe(dock);
    window.addEventListener('message',function(e){var d=e.data;if(d&&d.tl==='dv'&&d.vh){root.style.setProperty('--vh',(Math.max(300,+d.vh-80))+'px');report()}});
    setTimeout(report,50);setInterval(report,1000);
  }

  /* ---- lookup embedded on tlpowertrain.com: grow to full height, keep popups on screen ---- */
  if(EMBED){
    var last=0;
    function hreport(){
      var b=document.body,cs=getComputedStyle(b);
      var h=Math.ceil(b.getBoundingClientRect().height+parseFloat(cs.marginTop)+parseFloat(cs.marginBottom));
      if(Math.abs(h-last)>2){last=h;try{parent.postMessage({tl:'h',h:h},'*')}catch(e){}}
    }
    if(window.ResizeObserver)new ResizeObserver(hreport).observe(document.body);
    window.addEventListener('load',hreport);setInterval(hreport,1500);hreport();
    window.addEventListener('message',function(e){
      var d=e.data;if(!d||d.tl!=='v')return;
      var H=window.innerHeight,top=+d.top||0,vh=+d.vh||H;
      var vt=Math.max(0,-top),vbot=Math.min(H,vh-top);if(vbot<vt+150)vbot=Math.min(H,vt+150);
      root.style.setProperty('--vt',vt+'px');root.style.setProperty('--vh',(vbot-vt)+'px');root.style.setProperty('--vb',Math.max(0,H-vbot)+'px');
    });
  }
})();

/* Header on part / category pages: logo and button both go back to the Part Lookup. */
(function(){
  if(window.TL_DOCK||window.self!==window.top) return;
  var h=document.querySelector('header'); if(!h) return;
  var L='https://tlpowertrain.com/part-lookup';
  h.querySelectorAll('a').forEach(function(a){a.href=L;a.target='_top'});
  document.querySelectorAll('.crumb a').forEach(function(a){a.href=L;a.target='_top'});
  var n=h.querySelector('nav');
  if(n) n.innerHTML='<a class="tl-back" href="'+L+'">&larr; Back to Part Lookup</a>';
})();
