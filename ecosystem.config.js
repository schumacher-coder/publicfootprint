module.exports = {
  apps: [{
    name: 'publicfootprint',
    script: 'node_modules/.bin/next',
    args: 'start -p 3003',
    cwd: '/home/thomas/publicfootprint/apps/main',
    interpreter: '/opt/node22/bin/node',
    env: {
      NODE_ENV: 'production',
      PORT: '3003'
    },
    env_file: '.env',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/home/thomas/publicfootprint/logs/pm2-error.log',
    out_file: '/home/thomas/publicfootprint/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 10
  }]
};
