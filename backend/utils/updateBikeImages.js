// db required dynamically

const imageMap = {
  // Honda
  "Honda|Activa (110)": "https://imgd.aeplcdn.com/664x374/n/cw/ec/158485/activa-right-side-view.jpeg",
  "Honda|Dio (110)": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148465/dio-right-side-view.jpeg",
  "Honda|Activa 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148569/activa-125-right-side-view.jpeg",
  "Honda|Dio 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148467/dio-125-right-side-view.jpeg",
  "Honda|Activa e": "https://imgd.aeplcdn.com/664x374/n/cw/ec/191295/activa-e-right-side-view.jpeg",
  "Honda|QC1": "https://imgd.aeplcdn.com/664x374/n/cw/ec/180599/qc1-right-side-view.jpeg",
  "Honda|Shine 100": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141099/shine-100-right-side-view.jpeg",
  "Honda|Livo": "https://imgd.aeplcdn.com/664x374/n/cw/ec/145899/livo-right-side-view.jpeg",
  "Honda|SP 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148815/sp-125-right-side-view.jpeg",
  "Honda|CB 125 Hornet": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148815/sp-125-right-side-view.jpeg",
  "Honda|Unicorn": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148489/unicorn-right-side-view.jpeg",
  "Honda|SP 160": "https://imgd.aeplcdn.com/664x374/n/cw/ec/153243/sp-160-right-side-view.jpeg",
  "Honda|Hornet 2.0": "https://imgd.aeplcdn.com/664x374/n/cw/ec/149811/hornet-20-right-side-view.jpeg",
  // Original bikes
  "Yamaha|YZF R15 V4": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148829/yzf-r15-right-side-view.jpeg",
  "Royal Enfield|Classic 350": "https://imgd.aeplcdn.com/664x374/n/cw/ec/150825/classic-350-right-side-view.jpeg",
  "Honda|Shine 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44663/shine-125-right-side-view.jpeg",
  "KTM|Duke 390": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155139/390-duke-right-side-view.jpeg",
  "Bajaj|Pulsar NS200": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132735/pulsar-ns200-right-side-view.jpeg",
  "Ola|S1 Pro": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155257/s1-pro-right-side-view.jpeg",
  // Hero
  "Hero|Splendor Plus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44711/splendor-plus-right-side-view.jpeg",
  "Hero|Splendor Plus Xtec": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155855/splendor-plus-xtec-right-side-view.jpeg",
  "Hero|Splendor Plus Xtec 2.0": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155855/splendor-plus-xtec-right-side-view.jpeg",
  "Hero|HF Deluxe": "https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/hf-deluxe-right-side-view.jpeg",
  "Hero|HF 100": "https://imgd.aeplcdn.com/664x374/n/cw/ec/160697/hf-100-right-side-view.jpeg",
  "Hero|Passion Plus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41302/passion-plus-right-side-view.jpeg",
  "Hero|Passion Pro": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41300/passion-pro-right-side-view.jpeg",
  "Hero|Passion XPro": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41300/passion-pro-right-side-view.jpeg",
  "Hero|Super Splendor": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44697/super-splendor-right-side-view.jpeg",
  "Hero|Super Splendor Xtec": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44697/super-splendor-right-side-view.jpeg",
  "Hero|Glamour": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44689/glamour-right-side-view.jpeg",
  "Hero|Glamour Xtec": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44689/glamour-right-side-view.jpeg",
  "Hero|Glamour Fi": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44689/glamour-right-side-view.jpeg",
  "Hero|Xtreme 125R": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155807/xtreme-125r-right-side-view.jpeg",
  "Hero|Xtreme 160R": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155805/xtreme-160r-right-side-view.jpeg",
  "Hero|Xtreme 160R 4V": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155811/xtreme-160r-4v-right-side-view.jpeg",
  "Hero|Xpulse 200 4V": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155839/xpulse-200-4v-right-side-view.jpeg",
  "Hero|Xpulse 210": "https://imgd.aeplcdn.com/664x374/n/cw/ec/163343/xpulse-210-right-side-view.jpeg",
  "Hero|Karizma XMR": "https://imgd.aeplcdn.com/664x374/n/cw/ec/158687/karizma-xmr-right-side-view.jpeg",
  "Hero|Mavrick 440": "https://imgd.aeplcdn.com/664x374/n/cw/ec/163337/mavrick-440-right-side-view.jpeg",
  "Hero|Splendor Pro": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44711/splendor-plus-right-side-view.jpeg",
  "Hero|Splendor NXG": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44711/splendor-plus-right-side-view.jpeg",
  "Hero|Xtreme 250R": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155805/xtreme-160r-right-side-view.jpeg",
  "Hero|CBZ Xtreme": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44689/glamour-right-side-view.jpeg",
  "Hero|Hunk": "https://imgd.aeplcdn.com/664x374/n/cw/ec/44689/glamour-right-side-view.jpeg",
  "Hero|Impulse": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155839/xpulse-200-4v-right-side-view.jpeg",
  // TVS
  "TVS|Sport": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41290/sport-right-side-view.jpeg",
  "TVS|TVS Radeon": "https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/radeon-right-side-view.jpeg",
  "TVS|Star City Plus": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41298/star-city-right-side-view.jpeg",
  "TVS|Raider 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155149/raider-right-side-view.jpeg",
  "TVS|Apache RTR 160": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41462/apache-rtr-160-right-side-view.jpeg",
  "TVS|Apache RTR 160 4V": "https://imgd.aeplcdn.com/664x374/n/cw/ec/102657/apache-rtr-160-4v-right-side-view.jpeg",
  "TVS|Apache RTR 180": "https://imgd.aeplcdn.com/664x374/n/cw/ec/23279/apache-rtr-180-right-side-view.jpeg",
  "TVS|Apache RTR 200 4V": "https://imgd.aeplcdn.com/664x374/n/cw/ec/138417/apache-rtr-200-4v-right-side-view.jpeg",
  "TVS|Ronin": "https://imgd.aeplcdn.com/664x374/n/cw/ec/158689/ronin-right-side-view.jpeg",
  "TVS|Apache RTR 310": "https://imgd.aeplcdn.com/664x374/n/cw/ec/168943/apache-rtr-310-right-side-view.jpeg",
  "TVS|Apache RTX 300": "https://imgd.aeplcdn.com/664x374/n/cw/ec/168943/apache-rtr-310-right-side-view.jpeg",
  "TVS|Apache RR 310": "https://imgd.aeplcdn.com/664x374/n/cw/ec/135549/apache-rr-310-right-side-view.jpeg",
  "TVS|Jupiter 110": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41304/jupiter-right-side-view.jpeg",
  "TVS|Jupiter 125": "https://imgd.aeplcdn.com/664x374/n/cw/ec/141299/jupiter-125-right-side-view.jpeg",
  "TVS|Ntorq 125 Race Edition": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134591/ntorq-125-right-side-view.jpeg",
  "TVS|Ntorq 125 XT": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134591/ntorq-125-right-side-view.jpeg",
  "TVS|Scooty Pep+": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41294/scooty-pep-right-side-view.jpeg",
  "TVS|Scooty Zest 110": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41296/scooty-zest-110-right-side-view.jpeg",
  "TVS|XL 100 Comfort": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41292/xl-100-right-side-view.jpeg",
  "TVS|XL 100 Heavy Duty": "https://imgd.aeplcdn.com/664x374/n/cw/ec/41292/xl-100-right-side-view.jpeg",
  "TVS|iQube Standard": "https://imgd.aeplcdn.com/664x374/n/cw/ec/153273/iqube-right-side-view.jpeg",
  "TVS|iQube S": "https://imgd.aeplcdn.com/664x374/n/cw/ec/153273/iqube-right-side-view.jpeg",
  "TVS|iQube ST": "https://imgd.aeplcdn.com/664x374/n/cw/ec/153273/iqube-right-side-view.jpeg",
  // Royal Enfield
  "Royal Enfield|Hunter 350": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159751/hunter-350-right-side-view.jpeg",
  "Royal Enfield|Meteor 350": "https://imgd.aeplcdn.com/664x374/n/cw/ec/150561/meteor-350-right-side-view.jpeg",
  "Royal Enfield|Bullet 350": "https://imgd.aeplcdn.com/664x374/n/cw/ec/159711/bullet-350-right-side-view.jpeg",
  "Royal Enfield|Classic 350 (Chrome)": "https://imgd.aeplcdn.com/664x374/n/cw/ec/150825/classic-350-right-side-view.jpeg",
  "Royal Enfield|Himalayan 450": "https://imgd.aeplcdn.com/664x374/n/cw/ec/156549/himalayan-right-side-view.jpeg",
  "Royal Enfield|Guerrilla 450": "https://imgd.aeplcdn.com/664x374/n/cw/ec/169439/guerrilla-450-right-side-view.jpeg",
  "Royal Enfield|Scram 440": "https://imgd.aeplcdn.com/664x374/n/cw/ec/126101/scram-411-right-side-view.jpeg",
  "Royal Enfield|Interceptor 650": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134763/interceptor-650-right-side-view.jpeg",
  "Royal Enfield|Continental GT 650": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134765/continental-gt-650-right-side-view.jpeg",
  "Royal Enfield|Super Meteor 650": "https://imgd.aeplcdn.com/664x374/n/cw/ec/160643/super-meteor-650-right-side-view.jpeg",
  "Royal Enfield|Bear 650": "https://imgd.aeplcdn.com/664x374/n/cw/ec/160643/super-meteor-650-right-side-view.jpeg",
  "Royal Enfield|Flying Flea C6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/170001/flying-flea-c6-right-side-view.jpeg",
  "Royal Enfield|Flying Flea S6": "https://imgd.aeplcdn.com/664x374/n/cw/ec/170001/flying-flea-c6-right-side-view.jpeg",
  // Yamaha
  "Yamaha|FZ-Fi Version 3.0": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134305/fz-fi-right-side-view.jpeg",
  "Yamaha|FZS-Fi Version 3.0": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134309/fzs-fi-right-side-view.jpeg",
  "Yamaha|FZS-Fi Version 4.0 DLX": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134309/fzs-fi-right-side-view.jpeg",
  "Yamaha|FZ-X": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148825/fz-x-right-side-view.jpeg",
  "Yamaha|FZ Rave": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134305/fz-fi-right-side-view.jpeg",
  "Yamaha|FZ-S Fi Hybrid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/134309/fzs-fi-right-side-view.jpeg",
  "Yamaha|FZ-X Hybrid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148825/fz-x-right-side-view.jpeg",
  "Yamaha|MT-15 Version 2.0": "https://imgd.aeplcdn.com/664x374/n/cw/ec/145869/mt-15-right-side-view.jpeg",
  "Yamaha|YZF-R15S V3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148829/yzf-r15-right-side-view.jpeg",
  "Yamaha|YZF-R15 V4": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148829/yzf-r15-right-side-view.jpeg",
  "Yamaha|YZF-R15M": "https://imgd.aeplcdn.com/664x374/n/cw/ec/148833/yzf-r15m-right-side-view.jpeg",
  "Yamaha|XSR 155": "https://imgd.aeplcdn.com/664x374/n/cw/ec/145869/mt-15-right-side-view.jpeg",
  "Yamaha|MT-03": "https://imgd.aeplcdn.com/664x374/n/cw/ec/102811/mt-03-right-side-view.jpeg",
  "Yamaha|YZF-R3": "https://imgd.aeplcdn.com/664x374/n/cw/ec/155157/yzf-r3-right-side-view.jpeg",
  "Yamaha|Fascino 125 Fi Hybrid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/42305/fascino-125-fi-hybrid-right-side-view.jpeg",
  "Yamaha|New Fascino 125 Fi": "https://imgd.aeplcdn.com/664x374/n/cw/ec/42305/fascino-125-fi-hybrid-right-side-view.jpeg",
  "Yamaha|RayZR 125 Fi Hybrid": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132977/ray-zr-125-right-side-view.jpeg",
  "Yamaha|RayZR Street Rally 125 Fi": "https://imgd.aeplcdn.com/664x374/n/cw/ec/132977/ray-zr-125-right-side-view.jpeg",
  "Yamaha|Aerox 155 Version S": "https://imgd.aeplcdn.com/664x374/n/cw/ec/152239/aerox-right-side-view.jpeg",
};

const colorsMap = {
  // Honda
  "Honda|Activa (110)": '[{"name":"Decent Blue Metallic","hex":"#1A237E"},{"name":"Pearl Siren Blue","hex":"#0D47A1"},{"name":"Rebel Red Metallic","hex":"#B71C1C"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Black","hex":"#212121"}]',
  "Honda|Dio (110)": '[{"name":"Sports Red","hex":"#C62828"},{"name":"Vibrant Orange","hex":"#E65100"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Dazzle Yellow Metallic","hex":"#FDD835"}]',
  "Honda|Activa 125": '[{"name":"Rebel Red Metallic","hex":"#B71C1C"},{"name":"Heavy Grey Metallic","hex":"#546E7A"},{"name":"Pearl Night Star Black","hex":"#1A1A1A"},{"name":"Mid Night Blue Metallic","hex":"#0D47A1"}]',
  "Honda|Dio 125": '[{"name":"Sports Red","hex":"#C62828"},{"name":"Pearl Siren Blue","hex":"#0D47A1"},{"name":"Matte Axis Grey","hex":"#607D8B"},{"name":"Pearl Deep Ground Gray","hex":"#3E2723"}]',
  "Honda|Activa e": '[{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Matte Blue","hex":"#0D47A1"}]',
  "Honda|QC1": '[{"name":"White","hex":"#FAFAFA"},{"name":"Black","hex":"#212121"}]',
  "Honda|Shine 100": '[{"name":"Black with Red Stripes","hex":"#B71C1C"},{"name":"Black with Blue Stripes","hex":"#0D47A1"},{"name":"Black with Grey Stripes","hex":"#607D8B"}]',
  "Honda|Livo": '[{"name":"Athletic Blue Metallic","hex":"#1565C0"},{"name":"Imperial Red Metallic","hex":"#C62828"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Black","hex":"#212121"}]',
  "Honda|Shine 125": '[{"name":"Decent Blue Metallic","hex":"#1565C0"},{"name":"Rebel Red Metallic","hex":"#B71C1C"},{"name":"Geny Grey Metallic","hex":"#9E9E9E"},{"name":"Black","hex":"#212121"}]',
  "Honda|SP 125": '[{"name":"Imperial Red Metallic","hex":"#B71C1C"},{"name":"Black","hex":"#212121"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Athletic Blue Metallic","hex":"#0D47A1"}]',
  "Honda|CB 125 Hornet": '[{"name":"Striking Green","hex":"#2E7D32"},{"name":"Athletic Blue Metallic","hex":"#0D47A1"},{"name":"Sports Red","hex":"#B71C1C"}]',
  "Honda|Unicorn": '[{"name":"Imperial Red Metallic","hex":"#B71C1C"},{"name":"Pearl Igneous Black","hex":"#1A1A1A"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"}]',
  "Honda|SP 160": '[{"name":"Matte Marvel Blue Metallic","hex":"#0D47A1"},{"name":"Matte Dark Blue Metallic","hex":"#1A237E"},{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Pearl Igneous Black","hex":"#212121"}]',
  "Honda|Hornet 2.0": '[{"name":"Matte Axis Grey Metallic","hex":"#607D8B"},{"name":"Matte Sangria Red Metallic","hex":"#B71C1C"},{"name":"Matte Marvel Blue Metallic","hex":"#0D47A1"},{"name":"Limelight Yellow","hex":"#CDDC39"}]',
  // Royal Enfield
  "Royal Enfield|Classic 350": '[{"name":"Gunmetal Grey","hex":"#607D8B"},{"name":"Redditch Red","hex":"#B71C1C"},{"name":"Chrome Black","hex":"#212121"},{"name":"Signals Desert Storm","hex":"#8D6E63"}]',
  "Royal Enfield|Hunter 350": '[{"name":"Dapper Ash","hex":"#9E9E9E"},{"name":"Rebel Red","hex":"#C62828"},{"name":"Coastal Blue","hex":"#1565C0"},{"name":"Factory Black","hex":"#1A1A1A"}]',
  "Royal Enfield|Meteor 350": '[{"name":"Fireball Red","hex":"#B71C1C"},{"name":"Supernova Blue","hex":"#0D47A1"},{"name":"Stellar Black","hex":"#212121"},{"name":"Glitter & Dust","hex":"#8D6E63"}]',
  "Royal Enfield|Bullet 350": '[{"name":"Black Gold","hex":"#1A1A1A"},{"name":"Regal Red","hex":"#B71C1C"},{"name":"Signature Green","hex":"#1B5E20"}]',
  "Royal Enfield|Himalayan 450": '[{"name":"Kaza Brown","hex":"#6D4C41"},{"name":"Slate Himalayan Salt","hex":"#B0BEC5"},{"name":"Kamet White","hex":"#ECEFF1"},{"name":"Hanle Black","hex":"#212121"}]',
  "Royal Enfield|Guerrilla 450": '[{"name":"Drifter Blue","hex":"#0277BD"},{"name":"Mischief Head Black","hex":"#212121"},{"name":"Ramblin Red","hex":"#B71C1C"}]',
  "Royal Enfield|Interceptor 650": '[{"name":"Chrome Silver","hex":"#9E9E9E"},{"name":"Orange Crush","hex":"#E65100"},{"name":"Ventura Blue","hex":"#1A237E"},{"name":"Glitter & Dust","hex":"#795548"}]',
  "Royal Enfield|Continental GT 650": '[{"name":"Mr Clean","hex":"#ECEFF1"},{"name":"Rocker Red","hex":"#B71C1C"},{"name":"Dux Deluxe","hex":"#212121"},{"name":"British Racing Green","hex":"#1B5E20"}]',
  "Royal Enfield|Super Meteor 650": '[{"name":"Astral Black","hex":"#1A1A1A"},{"name":"Interstellar Green","hex":"#2E7D32"},{"name":"Astral Blue","hex":"#1565C0"}]',
  // Hero
  "Hero|Splendor Plus": '[{"name":"Sports Red","hex":"#C62828"},{"name":"Heavy Grey","hex":"#546E7A"},{"name":"Candy Blazing Red","hex":"#E53935"},{"name":"Black with Stripes","hex":"#212121"}]',
  "Hero|HF Deluxe": '[{"name":"Sports Red","hex":"#C62828"},{"name":"Black with Stripes","hex":"#1A1A1A"},{"name":"Blue","hex":"#1565C0"}]',
  "Hero|Glamour": '[{"name":"Pearl Silver","hex":"#B0BEC5"},{"name":"Sports Red","hex":"#C62828"},{"name":"Black","hex":"#212121"},{"name":"Matte Blue","hex":"#1565C0"}]',
  "Hero|Xtreme 160R": '[{"name":"Matte Blazing Red","hex":"#B71C1C"},{"name":"Candy Blazing Red","hex":"#E53935"},{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Black","hex":"#212121"}]',
  "Hero|Xpulse 200 4V": '[{"name":"Blazing Red","hex":"#C62828"},{"name":"Sports Yellow","hex":"#F9A825"},{"name":"White","hex":"#FAFAFA"}]',
  "Hero|Karizma XMR": '[{"name":"Matte Red","hex":"#B71C1C"},{"name":"Matte Blue","hex":"#0D47A1"},{"name":"Black","hex":"#212121"}]',
  "Hero|Mavrick 440": '[{"name":"Midnight Blue","hex":"#0D47A1"},{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Matt Red","hex":"#B71C1C"}]',
  // TVS
  "TVS|Apache RTR 160 4V": '[{"name":"Racing Red","hex":"#B71C1C"},{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Matte Black","hex":"#212121"},{"name":"Racing Blue","hex":"#0D47A1"}]',
  "TVS|Apache RTR 200 4V": '[{"name":"Racing Red","hex":"#B71C1C"},{"name":"Matte Black","hex":"#212121"},{"name":"Gloss White","hex":"#FAFAFA"}]',
  "TVS|Apache RR 310": '[{"name":"Dynamic Black","hex":"#212121"},{"name":"White","hex":"#FAFAFA"},{"name":"Racing Red","hex":"#B71C1C"}]',
  "TVS|Ronin": '[{"name":"Dune","hex":"#BCAAA4"},{"name":"Matte Blue","hex":"#1A237E"},{"name":"Matte Black","hex":"#212121"},{"name":"Storm White","hex":"#ECEFF1"}]',
  "TVS|Ntorq 125 Race Edition": '[{"name":"Matte Red","hex":"#B71C1C"},{"name":"Matte Blue","hex":"#1565C0"},{"name":"Pearl White","hex":"#FAFAFA"}]',
  "TVS|Jupiter 125": '[{"name":"Titanium Grey","hex":"#607D8B"},{"name":"Red","hex":"#C62828"},{"name":"White","hex":"#ECEFF1"},{"name":"Midnight Black","hex":"#212121"}]',
  "TVS|Raider 125": '[{"name":"Fiery Yellow","hex":"#F9A825"},{"name":"Matte Red","hex":"#B71C1C"},{"name":"Matte Black","hex":"#212121"},{"name":"Matte Blue","hex":"#1565C0"}]',
  "TVS|iQube ST": '[{"name":"Midnight Blue","hex":"#0D47A1"},{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Midnight Black","hex":"#212121"}]',
  // Yamaha
  "Yamaha|YZF-R15 V4": '[{"name":"Racing Blue","hex":"#0D47A1"},{"name":"Metallic Red","hex":"#B71C1C"},{"name":"Dark Knight","hex":"#212121"}]',
  "Yamaha|MT-15 Version 2.0": '[{"name":"Metallic Black","hex":"#212121"},{"name":"Ice Fluo-Vermillion","hex":"#FF5722"},{"name":"Cyan Storm","hex":"#00BCD4"}]',
  "Yamaha|FZ-Fi Version 3.0": '[{"name":"Metallic Black","hex":"#212121"},{"name":"Pewter Grey","hex":"#9E9E9E"},{"name":"Racing Blue","hex":"#1565C0"}]',
  "Yamaha|FZ-X": '[{"name":"Metallic Black","hex":"#212121"},{"name":"Matte Copper","hex":"#8D6E63"},{"name":"Blue","hex":"#1565C0"}]',
  "Yamaha|Aerox 155 Version S": '[{"name":"Metallic Blue","hex":"#1565C0"},{"name":"Matte Black","hex":"#212121"},{"name":"White","hex":"#ECEFF1"}]',
  "Yamaha|Fascino 125 Fi Hybrid": '[{"name":"Cyan","hex":"#00BCD4"},{"name":"Yellow","hex":"#FDD835"},{"name":"Pearl White","hex":"#FAFAFA"},{"name":"Black","hex":"#212121"}]',
  // KTM & Bajaj
  "KTM|Duke 390": '[{"name":"Orange","hex":"#E65100"},{"name":"Black","hex":"#212121"},{"name":"White","hex":"#ECEFF1"}]',
  "Bajaj|Pulsar NS200": '[{"name":"Burnt Red","hex":"#B71C1C"},{"name":"Pewter Grey","hex":"#546E7A"},{"name":"Ebony Black","hex":"#212121"}]',
  "Ola|S1 Pro": '[{"name":"Porcelain White","hex":"#ECEFF1"},{"name":"Midnight Blue","hex":"#0D47A1"},{"name":"Coral Glam","hex":"#E91E63"},{"name":"Jet Black","hex":"#212121"},{"name":"Neo Mint","hex":"#26A69A"}]',
};

async function updateBikeImages() {
  const db = require('../config/db');
  const sqliteDb = await db.getDbInstance();

  // Add colors column if not exists
  try {
    await sqliteDb.run('ALTER TABLE bikes ADD COLUMN colors TEXT');
    console.log('Added colors column.');
  } catch (e) { /* already exists */ }

  // Update images only if they are not already set to a valid external URL
  let imgCount = 0;
  for (const [key, url] of Object.entries(imageMap)) {
    const [brand, model] = key.split('|');
    const row = await sqliteDb.get('SELECT image FROM bikes WHERE brand = ? AND model = ?', [brand, model]);
    if (row && (!row.image || row.image.startsWith('/uploads/') || row.image.includes('664x374'))) {
      const result = await sqliteDb.run(
        'UPDATE bikes SET image = ? WHERE brand = ? AND model = ?',
        [url, brand, model]
      );
      if (result.changes > 0) imgCount++;
    }
  }
  console.log(`Updated images for ${imgCount} bikes.`);

  // Update colors
  let colorCount = 0;
  for (const [key, colors] of Object.entries(colorsMap)) {
    const [brand, model] = key.split('|');
    const result = await sqliteDb.run(
      'UPDATE bikes SET colors = ? WHERE brand = ? AND model = ?',
      [colors, brand, model]
    );
    if (result.changes > 0) colorCount++;
  }
  console.log(`Updated colors for ${colorCount} bikes.`);
}

module.exports = { updateBikeImages };
