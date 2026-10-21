export function aerodynamicScenario({ wind = 8, cp = .45, ct = .8, diameter = 145, density = 1.225 } = {}) {
  const area = Math.PI * (diameter / 2) ** 2;
  return { area, powerMW: .5 * density * area * cp * wind ** 3 / 1e6, thrustKN: .5 * density * area * ct * wind ** 2 / 1000 };
}

export function reversals(samples) {
  const values = samples.filter((value,index)=>Number.isFinite(value)&&(index===0||value!==samples[index-1]));
  if (values.length < 2) return values;
  const result = [values[0]];
  for (let index=1;index<values.length-1;index++) if ((values[index]-values[index-1])*(values[index+1]-values[index])<0) result.push(values[index]);
  result.push(values.at(-1));
  return result;
}

// Three-point rainflow stack; open residues are counted as half cycles.
export function rainflowCycles(samples) {
  const stack=[],cycles=[];
  const emit=(a,b,count)=>{const range=Math.abs(b-a);if(range>1e-10)cycles.push({range,mean:(a+b)/2,count})};
  for(const point of reversals(samples)) {
    stack.push(point);
    while(stack.length>=3) {
      const size=stack.length,older=Math.abs(stack[size-2]-stack[size-3]),newer=Math.abs(stack[size-1]-stack[size-2]);
      if(older>newer)break;
      if(size===3){emit(stack[0],stack[1],.5);stack.shift()}
      else {emit(stack[size-3],stack[size-2],1);stack.splice(size-3,2)}
    }
  }
  for(let index=0;index<stack.length-1;index++)emit(stack[index],stack[index+1],.5);
  return cycles;
}

export function syntheticRainflow({ wind=8,ct=.8 }={}) {
  const samples=Array.from({length:241},(_,index)=>{
    const time=index*.25,scale=100*ct*(wind/8)**2;
    return scale*(1+.25*Math.sin(2*Math.PI*.2*time)+.1*Math.sin(2*Math.PI*.6*time+.4)+.06*Math.sin(2*Math.PI*.035*time));
  });
  const cycles=rainflowCycles(samples),maxRange=Math.max(0,...cycles.map(c=>c.range));
  const bins=Array.from({length:5},(_,index)=>({from:maxRange*index/5,to:maxRange*(index+1)/5,count:0}));
  for(const cycle of cycles) bins[Math.min(4,Math.floor(cycle.range/(maxRange||1)*5))].count+=cycle.count;
  return {samples,cycles,bins,maxRange,count:cycles.reduce((total,cycle)=>total+cycle.count,0)};
}

export function inspectionTargets(data) {
  const scada=data?.scada,mechanical=data?.mechanical;
  const value=(number,suffix)=>Number.isFinite(number)?`${number.toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1})} ${suffix}`:'—';
  return [
    {view:'predictivo',label:'Tren de potencia',detail:'Temperatura y vibración equivalentes',metric:`${value(scada?.gearboxTempC,'°C')} · ${value(scada?.vibrationMmS,'mm/s')}`,review:Number.isFinite(scada?.gearboxTempC)&&Number.isFinite(scada?.vibrationMmS)?(scada.gearboxTempC>=70||scada.vibrationMmS>=2.3):null},
    {view:'predictivo-palas',label:'Palas y rodamientos',detail:'Pitch y desalineación estimada',metric:`Pitch ${value(scada?.pitchAngleDeg,'°')} · Yaw ${value(scada?.yawMisalignmentDeg,'°')}`,review:Number.isFinite(scada?.yawMisalignmentDeg)?Math.abs(scada.yawMisalignmentDeg)>=12:null},
    {view:'predictivo-base',label:'Torre y transición offshore',detail:'Carga mecánica equivalente',metric:value(mechanical?.mechanicalLoadPercent,'%'),review:Number.isFinite(mechanical?.mechanicalLoadPercent)?mechanical.mechanicalLoadPercent>=75:null},
  ].map(target=>({...target,status:target.review===null?'Sin estimaciones':target.review?'Revisar escenario':'Seguimiento de referencia'}));
}
