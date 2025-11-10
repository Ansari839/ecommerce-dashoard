# QWEN.md - eCommerce Dashboard LLM Instructions

Project: Full-featured eCommerce Admin Panel
Stack: Next.js (TS) + MongoDB + Mongoose + shadcn/ui

Modules:
1. Dashboard: Sales, orders, revenue charts
2. Products: CRUD, variants, inventory
3. Orders: Status tracking, invoices
4. Customers: Profile, LTV, segments
5. Payments: Gateway integration, refunds
6. Shipping: Courier API, tracking
7. Marketing: Coupons, recommendations
8. Reports: Sales, profit, traffic
9. Settings: Roles, tax, notifications
10. Vendors (optional): Marketplace support

Rules for LLM:
- Use TS types in all APIs
- Maintain modular folder structure
- Follow MVC: Models → Controllers → Routes
- Frontend: Component-based, reusable
- API responses should be JSON with status codes
- Role-based access for admin, manager, staff
