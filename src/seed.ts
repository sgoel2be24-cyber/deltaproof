import type { Project } from './schema';
export const seed:Project={name:'Northstar customer portal',client:'Northstar Studio',rate:90,hoursPerDay:8,bufferHours:4,baseline:[
{id:'SOW-01',kind:'included',source:'Statement of work · §1.1',text:'Customers can sign in with email and password and reset a forgotten password.'},
{id:'SOW-02',kind:'included',source:'Statement of work · §1.2',text:'The dashboard displays order status, delivery dates and a searchable order history.'},
{id:'SOW-03',kind:'included',source:'Statement of work · §1.3',text:'Customers can download a PDF invoice for an individual order.'},
{id:'SOW-04',kind:'excluded',source:'Statement of work · §2.1',text:'Bulk export of orders or invoices to CSV or spreadsheets is excluded from this release.'},
{id:'SOW-05',kind:'excluded',source:'Statement of work · §2.2',text:'Team accounts, inviting colleagues, multiple user roles and permission management are excluded.'},
{id:'SOW-06',kind:'included',source:'Statement of work · §1.4',text:'Two rounds of changes to colors, typography and spacing are included.'},
{id:'SOW-07',kind:'excluded',source:'Statement of work · §2.3',text:'Online payments, recurring subscriptions and refunds are not part of the customer portal.'}
],tasks:[{id:'identity',title:'Identity & access',hours:16,dependsOn:[]},{id:'data',title:'Order data layer',hours:24,dependsOn:[]},{id:'dashboard',title:'Customer dashboard',hours:16,dependsOn:['identity','data']},{id:'invoice',title:'Invoice download',hours:8,dependsOn:['data']},{id:'qa',title:'Integration & QA',hours:16,dependsOn:['dashboard','invoice']},{id:'launch',title:'Launch',hours:4,dependsOn:['qa']}]};
export const demoRequest='Could customers download all their orders as a spreadsheet?\nLet account owners invite colleagues with different permissions.\nPlease change the dashboard colors to match our new brand.';
export const examples=[{label:'The “small change”',text:demoRequest},{label:'Clearly included',text:'I forgot my password and need a way to reset it.\nLet customers search their past orders.'},{label:'Unknown territory',text:'Can the portal predict next quarter’s warehouse staffing requirements?'}];
