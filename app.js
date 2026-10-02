const screens=[...document.querySelectorAll('.screen')];
let activeAction='Pause SIP';
let choice='Pause SIP';
const titles={home:'Good morning, Aarav',sip:'Your SIP',intervention:'Before you decide',simulator:'Compare scenarios',why:'Why you’re seeing this',options:'Your choice',confirm:'Confirm action',feedback:'Feedback',goal:'Your goal'};
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

function show(id){
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  $$('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));
  $('#page-title').textContent=titles[id]||'Before You Pause';
  if(id==='goal') $('#goal .back-btn').dataset.screen='options';
  window.scrollTo({top:0,behavior:'smooth'});
}

function setAction(action){
  activeAction=action;
  $('#intervention-title').textContent='Before you '+(action==='Reduce SIP'?'reduce':'pause')+', here’s what this decision could change.';
}

function updateScenario(scenario){
  $$('.scenario').forEach(x=>x.classList.toggle('selected',x===scenario));
  const amount=Number(scenario.dataset.amount);
  const label=amount===10000?'Continue':amount===5000?'Reduce':'Pause';
  const total=amount===10000?'₹12L contributed over 10 years':amount===5000?'₹6L contributed over 10 years':'₹0 new contributions';
  const impact=amount===10000?'No contribution reduction':amount===5000?'₹5,000 less contributed this month':'Pause for 6 months → ₹60,000 less contributed toward your goal';
  $('.lede','#simulator').textContent='Same goal date. Different monthly contribution. Contribution impact only; no return prediction.';
  $$('.scenario',document).forEach(card=>{
    const cardAmount=Number(card.dataset.amount);
    card.querySelector('em').textContent=cardAmount===10000?'No contribution reduction':cardAmount===5000?'₹5,000 less contributed this month':'Pause for 6 months → ₹60,000 less contributed toward your goal';
    card.querySelector('em').classList.add('contribution-only');
    card.querySelector('small').textContent=cardAmount===10000?'₹12L contributed over 10 years':cardAmount===5000?'₹6L contributed over 10 years':'₹0 new contributions';
    card.setAttribute('aria-pressed',String(card===scenario));
  });
  let impactNode=$('#scenario-impact');
  if(!impactNode){
    impactNode=document.createElement('p');
    impactNode.id='scenario-impact';
    impactNode.className='scenario-impact';
    $('.compare-chart').prepend(impactNode);
  }
  impactNode.textContent='Selected: '+label+' · '+(amount===0?'₹0/month':'₹'+amount.toLocaleString('en-IN')+'/month')+' · '+total+' · '+impact;
  $$('.bar-row').forEach(row=>{
    const name=$('label',row)?.textContent.trim();
    row.classList.toggle('selected-row',name===label);
  });
}

function updateConfirmation(action){
  choice=action;
  $('#confirm-title').textContent='You chose '+action;
  $('#confirm-action').textContent=action;
  const lead=$('#confirm .lede');
  const rows=$$('#confirm .confirm-card > div strong');
  if(action==='Reduce SIP'){
    lead.textContent='Your next contribution will be reduced from ₹10,000 to ₹5,000 on 5 Oct 2026 if you confirm.';
    rows[1].textContent='₹5,000 less contributed this month';
    rows[2].textContent='You can resume or change this SIP later';
  }else if(action==='Continue SIP'){
    lead.textContent='Your SIP will remain ₹10,000/month. No change will be made if you confirm.';
    rows[1].textContent='No contribution change this month';
    rows[2].textContent='No transaction will be executed until you confirm';
  }else{
    lead.textContent='Your next ₹10,000 instalment on 5 Oct 2026 will not be invested if you confirm this action.';
    rows[1].textContent='Contribution gap of ₹10,000 for this month';
    rows[2].textContent='You can resume or change this SIP later';
  }
}

document.addEventListener('click',e=>{
  const button=e.target.closest('[data-screen]');
  if(button){
    e.preventDefault();
    if(button.dataset.action)setAction(button.dataset.action);
    show(button.dataset.screen);
    return;
  }
  const scenario=e.target.closest('.scenario');
  if(scenario){e.preventDefault();updateScenario(scenario);return;}
});

$$('.option-card').forEach(btn=>btn.addEventListener('click',()=>{
  const selected=btn.dataset.choice;
  if(selected==='Review goal'){show('goal');return;}
  updateConfirmation(selected);
  show('confirm');
}));

$('#confirm-btn').addEventListener('click',()=>show('feedback'));
$$('.feedback-buttons button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.feedback-buttons button').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
}));
$('#feedback-submit').addEventListener('click',()=>$('#feedback-thanks').classList.remove('hidden'));

$$('.fund-info strong, .fund-header strong, #sip .section-head h2').forEach(el=>el.textContent='Illustrative Flexi Cap Fund');
$('#page-title').textContent='Good morning, Aarav';
updateScenario($('.scenario.selected'));
