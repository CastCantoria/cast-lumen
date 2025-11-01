import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

function readFiles(pattern){
  return glob.sync(pattern, {nodir: true}).map(fp=>({fp,content: fs.readFileSync(fp,'utf8')}));
}

function extractLinks(files){
  const links = new Set();
  const re = /to=\"(\/[^\"\s>]*)/g;
  files.forEach(f=>{
    let m;
    while((m=re.exec(f.content))!==null){
      links.add(m[1]);
    }
  });
  return Array.from(links).sort();
}

function extractRoutes(files){
  const routes = new Set();
  const re = /Route\s+path=\"([^\"]+)\"/g;
  files.forEach(f=>{
    let m;
    while((m=re.exec(f.content))!==null){
      routes.add(m[1]);
    }
  });
  // Also capture Route path="/..." in App.jsx where full paths exist
  const re2 = /<Route\s+path=\"(\/[^\"]*)\"/g;
  files.forEach(f=>{
    let m;
    while((m=re2.exec(f.content))!==null){
      routes.add(m[1]);
    }
  });
  return Array.from(routes).sort();
}

const srcFiles = readFiles('src/**/*.{js,jsx}');
const links = extractLinks(srcFiles);
const routes = extractRoutes(srcFiles);

// Expand nested routes: handle routes that are relative (no leading slash) under parent mounts.
// Find parent mounts in App.jsx: Route path="/dashboard/super-admin/*"
const mounts = [];
const app = srcFiles.find(f=>/src\/App\.jsx$/.test(f.fp) || /App\.jsx$/.test(f.fp));
if(app){
  const mRe = /<Route\s+path=\"(\/[^\"]*\*?)\"/g;
  let m;
  while((m=mRe.exec(app.content))!==null){
    mounts.push(m[1]);
  }
}

// For now, consider that relative routes under a mount like /dashboard/super-admin/* will be prefixed by /dashboard/super-admin
const expanded = new Set(routes);
srcFiles.forEach(f=>{
  if(/SuperAdminDashboard\.jsx/.test(f.fp)){
    // find routes defined without leading slash
    const re = /<Route\s+path=\"([^\"/][^\"]*)\"/g;
    let m;
    while((m=re.exec(f.content))!==null){
      // prefix with mount if found
      const mount = '/dashboard/super-admin';
      expanded.add(mount + '/' + m[1]);
    }
  }
  // admin dashboard? look for AdminDashboard.jsx under pages/app/dashboards/admin
  if(/AdminDashboard\.jsx/.test(f.fp)){
    // this file uses to="/dashboard/admin/..." links so routes likely under /dashboard/admin but we'll search for Route path="..." in other files
  }
});

const defined = Array.from(expanded).sort();

// Compare
const missing = links.filter(l=>{
  // allow dynamic param routes like /dashboard/super-admin/users/:id -> /dashboard/super-admin/users/123 should be considered matching /dashboard/super-admin/users/:id if prefix matches
  const match = defined.some(r=>{
    if(r.endsWith('*')){
      const base = r.replace(/\*$/,'').replace(/\/$/,'');
      return l === base || l.startsWith(base + '/') || l === base + '/';
    }
    // handle param
    if(r.includes(':')){
      const partsR = r.split('/').filter(Boolean);
      const partsL = l.split('/').filter(Boolean);
      if(partsR.length !== partsL.length) return false;
      for(let i=0;i<partsR.length;i++){
        if(partsR[i].startsWith(':')) continue;
        if(partsR[i] !== partsL[i]) return false;
      }
      return true;
    }
    return r === l;
  });
  return !match;
});

const out = {links, defined, missing};
fs.writeFileSync('tools/link-audit-output.json', JSON.stringify(out,null,2));
console.log('WROTE tools/link-audit-output.json');
