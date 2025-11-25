# System Requirements for Strapi Admin Dashboard

This document outlines the recommended system requirements for hosting the Strapi Admin Dashboard application in a production environment.

## Application Overview
- **Application Type**: Strapi CMS (Content Management System)
- **Strapi Version**: 5.31.1
- **Framework**: Node.js with React Admin Panel
- **Database**: Supports PostgreSQL, MySQL, or SQLite

---

## Minimum Requirements

### Server Specifications
- **CPU**: 2 cores (2.0 GHz or higher)
- **RAM**: 2 GB
- **Storage**: 10 GB SSD (minimum)
- **Network**: 100 Mbps connection

### Software Requirements
- **Node.js**: Version 20.x.x to 24.x.x (LTS recommended: 20.x or 22.x)
- **npm**: Version 6.0.0 or higher (or yarn/pnpm equivalent)
- **Operating System**: 
  - Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+, or similar)
  - Windows Server 2019+ (for Windows hosting)
  - macOS (for development only)

---

## Recommended Requirements (Production)

### Server Specifications
- **CPU**: 4 cores (2.4 GHz or higher)
- **RAM**: 4-8 GB
- **Storage**: 50-100 GB SSD (depends on file uploads)
- **Network**: 1 Gbps connection
- **Bandwidth**: Sufficient for expected traffic (estimate based on user base)

### Software Requirements
- **Node.js**: Version 20.x.x LTS or 22.x.x LTS
- **npm**: Version 9.x or higher
- **Process Manager**: PM2, systemd, or similar for process management
- **Reverse Proxy**: Nginx or Apache (recommended)
- **SSL Certificate**: Required for HTTPS

---

## Database Requirements

### PostgreSQL (Recommended for Production)
- **Version**: PostgreSQL 12+ (13+ recommended)
- **Storage**: Separate from application storage
- **RAM**: 2-4 GB dedicated
- **Connection Pool**: Configured (min: 2, max: 10 as per config)

### MySQL (Alternative)
- **Version**: MySQL 8.0+ or MariaDB 10.5+
- **Storage**: Separate from application storage
- **RAM**: 2-4 GB dedicated
- **Connection Pool**: Configured (min: 2, max: 10 as per config)

### SQLite (Development Only)
- **Not recommended for production**
- Suitable only for development and testing

---

## Storage Requirements

### Application Files
- **Base Application**: ~500 MB - 1 GB
- **Node Modules**: ~500 MB - 1 GB
- **Build Files**: ~100-200 MB

### User-Generated Content
- **File Uploads**: Varies based on usage
  - Images: Estimate 1-5 MB per upload (with thumbnails)
  - Documents: Varies significantly
  - Plan for growth: 10-50 GB minimum for active sites

### Logs
- **Application Logs**: 1-5 GB (with rotation)
- **Access Logs**: 1-10 GB (depends on traffic)

**Total Storage Estimate**: 20-100 GB (depending on content volume)

---

## Network & Security Requirements

### Ports
- **Application Port**: 1337 (default, configurable via `PORT` env variable)
- **Database Port**: 
  - PostgreSQL: 5432
  - MySQL: 3306
- **HTTPS**: 443 (via reverse proxy)
- **HTTP**: 80 (redirect to HTTPS)

### Security
- **Firewall**: Configured to allow only necessary ports
- **SSL/TLS**: Required for production (Let's Encrypt recommended)
- **Environment Variables**: Secure storage for sensitive data
- **Backup**: Automated daily backups recommended

---

## Environment Variables Required

The following environment variables need to be configured:

### Application
- `NODE_ENV=production`
- `HOST=0.0.0.0` (or specific IP)
- `PORT=1337` (or your chosen port)
- `APP_KEYS` (array of 4 random strings)

### Database
- `DATABASE_CLIENT=postgres` (or `mysql` for MySQL)
- `DATABASE_HOST=<database-host>`
- `DATABASE_PORT=<database-port>`
- `DATABASE_NAME=<database-name>`
- `DATABASE_USERNAME=<database-user>`
- `DATABASE_PASSWORD=<database-password>`
- `DATABASE_SSL=true` (for production)
- `DATABASE_POOL_MIN=2`
- `DATABASE_POOL_MAX=10`

### Email (if using nodemailer)
- Email service configuration (SMTP settings)

---

## Performance Considerations

### Memory Usage
- **Base Strapi**: ~200-400 MB
- **With Admin Panel**: ~300-500 MB
- **Under Load**: 1-2 GB (depending on concurrent users)
- **Recommended**: 4 GB+ for comfortable operation

### CPU Usage
- **Idle**: < 5% of 1 core
- **Normal Load**: 10-30% of 1-2 cores
- **High Load**: 50-80% of 2-4 cores
- **Recommended**: 4 cores for production

### Concurrent Users

#### Understanding Concurrent Users
**Concurrent users** refers to users actively making requests at the same time, not total registered users. A typical user might make 1-5 requests per minute when actively browsing.

#### Capacity Estimates by Server Configuration

**Minimum Configuration (2 CPU cores, 2 GB RAM)**
- **Concurrent Users**: 20-50 users
- **Requests per Second**: 10-25 RPS
- **Suitable for**: Small internal tools, low-traffic sites
- **Limitations**: May struggle with file uploads or complex queries

**Recommended Configuration (4 CPU cores, 4-8 GB RAM)**
- **Concurrent Users**: 100-300 users
- **Requests per Second**: 50-150 RPS
- **Suitable for**: Medium-sized websites, public-facing CMS
- **Performance**: Good balance of cost and performance

**High-Performance Configuration (8 CPU cores, 8-16 GB RAM)**
- **Concurrent Users**: 300-800 users
- **Requests per Second**: 150-400 RPS
- **Suitable for**: High-traffic websites, enterprise applications
- **Performance**: Can handle complex queries and file operations efficiently

**Enterprise Configuration (16+ CPU cores, 16+ GB RAM, Load Balanced)**
- **Concurrent Users**: 800-2000+ users
- **Requests per Second**: 400-1000+ RPS
- **Suitable for**: Large-scale applications, multiple Strapi instances
- **Performance**: Requires horizontal scaling with load balancer

#### Factors Affecting Concurrent User Capacity

1. **Request Type**:
   - **Simple GET requests** (reading content): ~100-200 per second per core
   - **Complex queries** (with filters, relations): ~20-50 per second per core
   - **File uploads**: ~5-10 per second per core (depends on file size)
   - **Admin panel operations**: ~10-30 per second per core

2. **Database Performance**:
   - **PostgreSQL/MySQL**: Well-optimized can handle 500-1000+ concurrent connections
   - **Database queries**: Most common bottleneck
   - **Connection pooling**: Critical (configured min: 2, max: 10 in your setup)

3. **Content Complexity**:
   - **Simple content** (text, basic fields): Higher capacity
   - **Complex content** (relations, media, nested data): Lower capacity
   - Your application has 12+ content types with relations, which is moderate complexity

4. **Caching**:
   - **Without caching**: Lower capacity
   - **With Redis/CDN caching**: 2-5x capacity increase possible

#### Real-World Scenarios

**Scenario 1: Public Website (Read-Heavy)**
- **Configuration**: 4 CPU, 4 GB RAM
- **Concurrent Users**: 150-250 users
- **Typical Usage**: 80% read (GET), 20% write (POST/PUT)
- **Peak Traffic**: Can handle 2-3x normal load for short bursts

**Scenario 2: Admin Dashboard (Write-Heavy)**
- **Configuration**: 4 CPU, 8 GB RAM
- **Concurrent Admin Users**: 20-50 users
- **Typical Usage**: 40% read, 60% write (content management)
- **Note**: Admin operations are more resource-intensive

**Scenario 3: Mixed Usage (Public + Admin)**
- **Configuration**: 4 CPU, 8 GB RAM
- **Concurrent Public Users**: 100-200 users
- **Concurrent Admin Users**: 10-20 users
- **Total Capacity**: 110-220 concurrent users

#### Performance Optimization Tips

To increase concurrent user capacity:

1. **Enable Caching**: Use Redis for session and query caching
2. **Database Optimization**: 
   - Add proper indexes
   - Optimize queries
   - Use read replicas for high-traffic scenarios
3. **CDN**: Offload static files and uploads to CDN
4. **Connection Pooling**: Tune database connection pool (currently 2-10)
5. **Load Balancing**: Scale horizontally with multiple Strapi instances
6. **Database Separation**: Use separate database server

#### Capacity Planning Formula

**Rough Estimate**:
```
Concurrent Users ≈ (CPU Cores × 50-100) × Optimization Factor

Optimization Factor:
- No optimization: 0.5-0.7
- Basic optimization (caching, indexes): 0.8-1.0
- Advanced optimization (CDN, load balancing): 1.2-1.5
```

**Example**:
- 4 CPU cores with basic optimization: 4 × 75 × 0.9 ≈ **270 concurrent users**
- 8 CPU cores with advanced optimization: 8 × 75 × 1.3 ≈ **780 concurrent users**

#### Monitoring Concurrent Users

Track these metrics to understand your actual capacity:
- **Active connections**: Real-time concurrent users
- **Response time**: Should stay < 500ms for 95% of requests
- **Error rate**: Should be < 1%
- **CPU usage**: Should average < 70% under normal load
- **Memory usage**: Should stay < 80% of available RAM
- **Database connections**: Monitor pool usage

---

## Deployment Recommendations

### Process Management
- Use **PM2** for Node.js process management
- Configure auto-restart on crashes
- Set up log rotation

### Reverse Proxy
- **Nginx** or **Apache** in front of Strapi
- SSL termination at reverse proxy
- Static file serving for uploads (optional optimization)

### Monitoring
- Application monitoring (PM2, New Relic, etc.)
- Database monitoring
- Server resource monitoring (CPU, RAM, Disk)
- Uptime monitoring

### Backup Strategy
- **Database**: Daily automated backups
- **File Uploads**: Daily automated backups
- **Configuration**: Version controlled
- **Retention**: 7-30 days minimum

---

## Cloud Hosting Recommendations

### Suitable Platforms
- **VPS**: DigitalOcean, Linode, Vultr (4 GB RAM, 2-4 vCPU)
- **Cloud**: AWS EC2, Google Cloud Platform, Azure
- **PaaS**: Railway, Render, Heroku (with appropriate dyno size)
- **Strapi Cloud**: Official Strapi hosting solution

### Minimum Cloud Instance Sizes
- **AWS EC2**: t3.medium (2 vCPU, 4 GB RAM) or larger
- **DigitalOcean**: 4 GB Droplet or larger
- **Google Cloud**: e2-medium (2 vCPU, 4 GB RAM) or larger

---

## Scaling Considerations

### Vertical Scaling
- Increase CPU and RAM as traffic grows
- Upgrade database instance size

### Horizontal Scaling
- Strapi can be scaled horizontally with load balancer
- Shared database and file storage required
- Consider using object storage (S3, Cloudinary) for uploads

### Database Scaling
- Read replicas for high-traffic scenarios
- Connection pooling optimization
- Query optimization and indexing

---

## Additional Notes

1. **Development vs Production**: These requirements are for production. Development can run on lower specs.

2. **File Storage**: Consider using cloud storage (AWS S3, Cloudinary, etc.) for file uploads instead of local storage for better scalability.

3. **CDN**: Consider using a CDN for serving static assets and uploaded files.

4. **Caching**: Implement Redis or similar for session storage and caching if needed.

5. **Email Service**: Configure proper SMTP settings or use email service providers (SendGrid, Mailgun, etc.).

---

## Quick Start Checklist

- [ ] Server with minimum 4 GB RAM, 4 CPU cores
- [ ] Node.js 20.x or 22.x installed
- [ ] PostgreSQL 12+ or MySQL 8.0+ database
- [ ] Nginx/Apache reverse proxy configured
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] PM2 or process manager installed
- [ ] Backup strategy implemented
- [ ] Monitoring tools set up
- [ ] Firewall configured

---

**Last Updated**: Based on Strapi 5.31.1 and Node.js 20-24 requirements
**Application**: Admin Dashboard (Strapi CMS)

