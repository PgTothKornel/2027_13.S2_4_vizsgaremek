export type Recipe = { id: string; title: string; type: string; time: number; kcal: number; protein: number; match: number; image: string | null; tags: string[]; servings: number; ingredients: [string, number, string, boolean][]; description: string };
export type PantryItem = { id: number; name: string; qty: number | null; unit: string; category: string };
export type ShoppingItem = { id: number; name: string; qty: string; source: string; bought: boolean };
export type Route = 'home' | 'discover' | 'pantry' | 'favorites' | 'shopping' | 'profile';
export const recipes: Recipe[] = [
  {id:'shakshuka',title:'Füstös shakshuka',type:'Reggeli · húsmentes',time:24,kcal:420,protein:23,match:86,image:'/assets/shakshuka.png',tags:['quick','vegetarian','high-protein'],servings:2,ingredients:[['Tojás',4,'db',true],['Paradicsom',500,'g',true],['Kaliforniai paprika',1,'db',true],['Feta',80,'g',false],['Petrezselyem',1,'csokor',true]],description:'Selymes paradicsomos-paprikás alap, lágy tojások és friss zöldfűszerek egyetlen serpenyőben.'},
  {id:'salmon',title:'Citromos lazac',type:'Vacsora · magas fehérje',time:32,kcal:560,protein:42,match:72,image:'/assets/salmon.png',tags:['high-protein'],servings:2,ingredients:[['Lazacfilé',300,'g',false],['Spárga',250,'g',true],['Burgonya',400,'g',true],['Citrom',1,'db',true],['Kapor',1,'csokor',false]],description:'Ropogós szélű lazac, zsenge spárga és aranybarna burgonya friss citrommal.'},
  {id:'pasta',title:'Krémes paradicsomos pasta',type:'Ebéd · komfort étel',time:28,kcal:610,protein:24,match:91,image:'/assets/hero-pasta.png',tags:['quick','vegetarian'],servings:2,ingredients:[['Rigatoni',220,'g',true],['Koktélparadicsom',350,'g',true],['Tejszín',120,'ml',false],['Parmezán',60,'g',true],['Bazsalikom',1,'csokor',true]],description:'Sült paradicsom, krémes szósz és friss bazsalikom — gyors hétköznapi vacsora, éttermi hangulattal.'},
  {id:'chickpea',title:'Ropogós csicseriborsó tál',type:'Ebéd · növényi',time:20,kcal:480,protein:21,match:78,image:null,tags:['quick','vegetarian'],servings:2,ingredients:[['Csicseriborsó',400,'g',false],['Uborka',1,'db',true],['Paradicsom',2,'db',true],['Tahini',40,'g',false],['Citrom',1,'db',true]],description:'Fűszeres, ropogós és friss tál krémes tahinis öntettel.'},
  {id:'chicken',title:'Mézes-mustáros csirke',type:'Vacsora · családi',time:38,kcal:525,protein:45,match:67,image:null,tags:['high-protein'],servings:4,ingredients:[['Csirkemell',600,'g',false],['Mustár',45,'g',true],['Méz',30,'g',true],['Rizs',300,'g',true],['Brokkoli',400,'g',false]],description:'Szaftos csirkemell kiegyensúlyozott, édeskés-mustáros szósszal.'},
  {id:'soup',title:'Sültpaprika-krémleves',type:'Vacsora · húsmentes',time:45,kcal:330,protein:12,match:83,image:null,tags:['vegetarian'],servings:4,ingredients:[['Kaliforniai paprika',5,'db',true],['Paradicsom',3,'db',true],['Zöldségalaplé',700,'ml',false],['Tejszín',100,'ml',false],['Kenyér',4,'szelet',true]],description:'Intenzív, selymes leves ropogós kenyérrel és egy kevés füstös paprikával.'}
];

export const defaultPantry: PantryItem[] = [
  {id:1,name:'Paradicsom',qty:6,unit:'db',category:'Zöldség és gyümölcs'},
  {id:2,name:'Citrom',qty:2,unit:'db',category:'Zöldség és gyümölcs'},
  {id:3,name:'Bazsalikom',qty:1,unit:'csokor',category:'Zöldség és gyümölcs'},
  {id:4,name:'Tojás',qty:8,unit:'db',category:'Hűtő'},
  {id:5,name:'Parmezán',qty:120,unit:'g',category:'Hűtő'},
  {id:6,name:'Rigatoni',qty:500,unit:'g',category:'Szárazáru'},
  {id:7,name:'Rizs',qty:800,unit:'g',category:'Szárazáru'},
  {id:8,name:'Füstölt paprika',qty:null,unit:'',category:'Fűszerek'}
];
export const defaultShopping: ShoppingItem[] =[
  {id:1,name:'Lazacfilé',qty:'300 g',source:'Citromos lazac',bought:false},
  {id:2,name:'Spárga',qty:'250 g',source:'Citromos lazac',bought:false},
  {id:3,name:'Feta',qty:'80 g',source:'Füstös shakshuka',bought:true}
];


export const navItems = [
 {route:'discover', label:'Felfedezés', icon:'✦'}, {route:'pantry', label:'Kamrám', icon:'▦'},
 {route:'favorites', label:'Kedvencek', icon:'♡'}, {route:'shopping', label:'Lista', icon:'✓'}, {route:'profile', label:'Profil', icon:'◉'}
] as const;
export const categories = ['Zöldség és gyümölcs', 'Hűtő', 'Szárazáru', 'Fűszerek'];
