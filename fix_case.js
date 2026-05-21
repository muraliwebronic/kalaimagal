const fs = require('fs');
const path = require('path');

const models = [
  'User', 'Session', 'ApiToken', 'Author', 'Category', 'Tag', 'Content', 
  'ContentAuthor', 'ContentCategory', 'ContentTag', 'Series', 'ReadingProgress', 
  'Bookmark', 'Highlight', 'Favorite', 'Review', 'Comment', 'ReviewVote', 
  'SubscriptionPlan', 'Subscription', 'Payment', 'Coupon', 'CouponUsage', 
  'Invoice', 'Notification', 'EmailLog', 'WebhookLog', 'AuditLog', 'ActivityLog',
  'ContactSubmission', 'MediaAsset', 'NewsletterSubscriber', 'Setting'
];

let sql = fs.readFileSync(path.join(__dirname, 'data_cmd.sql'), 'utf-8');

for (const model of models) {
  const lower = model.toLowerCase();
  const regex = new RegExp(`\\\`${lower}\\\``, 'g');
  sql = sql.replace(regex, `\`${model}\``);
}

const finalSql = "SET FOREIGN_KEY_CHECKS=0;\n" + sql + "\nSET FOREIGN_KEY_CHECKS=1;\n";

fs.writeFileSync(path.join(__dirname, 'data_pascal.sql'), finalSql);
console.log('Fixed case sensitivity and added FK check skips.');
