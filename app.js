const flavors = [
  {src:'flavor-berry.png',name:'Berry · golden crumble',alt:'Berry real fruit ice cream with golden crumble in a bastani cup'},
  {src:'flavor-banana.png',name:'Banana · rainbow sprinkles',alt:'Banana real fruit ice cream with rainbow sprinkles in a bastani cup'},
  {src:'flavor-strawberry.png',name:'Strawberry · Oreo crumble',alt:'Strawberry real fruit ice cream with Oreo crumble in a bastani cup'},
  {src:'flavor-cherry.png',name:'Cherry · almond & coconut',alt:'Cherry real fruit ice cream with sliced almonds and shredded coconut in a bastani cup'}
];
const button=document.getElementById('flavor-switch');
const productImage=document.querySelector('.flavor-image');
const caption=document.getElementById('flavor-caption');
const status=document.getElementById('status');
let current=0,busy=false;
const images=flavors.map(f=>{const image=new Image();image.src=f.src;return image;});
async function nextFlavor(){
  if(busy)return;
  busy=true;button.setAttribute('aria-busy','true');
  const next=(current+1)%flavors.length;
  try{
    await images[next].decode();
    productImage.src=flavors[next].src;
    productImage.alt=flavors[next].alt;
    caption.textContent=flavors[next].name;
    status.textContent='Now showing '+flavors[next].name;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&productImage.animate){
      productImage.animate([{opacity:.25},{opacity:1}],{duration:260,easing:'ease-out'});
    }
    current=next;
  }catch(error){status.textContent='This flavor could not load. Please try again.';}
  finally{busy=false;button.removeAttribute('aria-busy');}
}
button.addEventListener('click',nextFlavor);

// Keep the logo overlay out of layout; preserve the original direct-image sizing.
const cupMark=document.querySelector('.cup-mark');
function alignCupMark(){
  const w=productImage.clientWidth,h=productImage.clientHeight;
  const ratio=(productImage.naturalWidth||1024)/(productImage.naturalHeight||1536);
  const fitW=Math.min(w,h*ratio),fitH=fitW/ratio;
  Object.assign(cupMark.style,{
    left:(productImage.offsetLeft+(w-fitW)/2+fitW*.388)+'px',
    top:(productImage.offsetTop+(h-fitH)/2+fitH*.771)+'px',
    width:fitW*.236+'px',height:fitH*.157+'px'
  });
}
productImage.addEventListener('load',alignCupMark);
new ResizeObserver(alignCupMark).observe(productImage);
alignCupMark();
