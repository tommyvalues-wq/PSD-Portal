<%- include('layout-top') %>
<section class="panel"><h1>Audit Log</h1><table><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead><tbody><% rows.forEach(r=>{ %><tr><td><%= r.created_at %></td><td><%= r.username || 'System' %></td><td><%= r.action %></td><td><%= r.entity %> #<%= r.entity_id %></td><td><%= r.details %></td></tr><% }) %></tbody></table></section>
<%- include('layout-bottom') %>
