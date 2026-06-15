const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'portal.json');

function ensureDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const starter = {
      users: [],
      firefighters: [],
      disciplinary_actions: [],
      audit_log: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(starter, null, 2));
  }
}

function load() {
  ensureDb();
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw || '{}');
  db.users ||= [];
  db.firefighters ||= [];
  db.disciplinary_actions ||= [];
  db.audit_log ||= [];
  return db;
}

function save(db) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function next(db, table) {
  const rows = db[table] || [];
  return rows.length ? Math.max(...rows.map(r => Number(r.id) || 0)) + 1 : 1;
}

function now() {
  return new Date().toISOString();
}

function audit(actor, action, entity, entityId, details = '') {
  const db = load();
  db.audit_log.unshift({
    id: next(db, 'audit_log'),
    actor_user_id: actor?.id || null,
    username: actor?.username || 'System',
    action,
    entity,
    entity_id: String(entityId ?? ''),
    details: String(details ?? ''),
    created_at: now()
  });
  save(db);
}

function seedOwner() {
  const robloxId = process.env.INITIAL_OWNER_ROBLOX_ID;
  if (!robloxId) return;
  const db = load();
  let owner = db.users.find(u => String(u.roblox_id) === String(robloxId));
  if (!owner) {
    owner = {
      id: next(db, 'users'),
      roblox_id: String(robloxId),
      username: 'Initial Owner',
      display_name: 'Initial Owner',
      avatar_url: '',
      role: 'owner',
      is_allowed: 1,
      created_at: now(),
      updated_at: now()
    };
    db.users.push(owner);
  } else {
    owner.role = 'owner';
    owner.is_allowed = 1;
    owner.updated_at = now();
  }
  save(db);
}

module.exports = { load, save, next, now, audit, seedOwner };
