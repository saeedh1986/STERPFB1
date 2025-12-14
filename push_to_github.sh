#!/bin/bash

# =================================================================
# هذا الملف سيقوم برفع كود المشروع إلى حسابك على GitHub
# الرجاء اتباع التعليمات التي ستظهر لك في الطرفية (Terminal)
# =================================================================

# الخطوة 1: التأكد من أن اسم الفرع المحلي هو 'main'
# This ensures your local branch is named 'main', matching GitHub.
echo "الخطوة 1: ضبط اسم الفرع إلى 'main'..."
git branch -M main

# الخطوة 2: إضافة جميع ملفات المشروع إلى Git
# This command stages all your project files, preparing them for a commit.
echo "الخطوة 2: إضافة جميع ملفات المشروع..."
git add .

# الخطوة 3: إنشاء "حفظ" (commit) جديد للتغييرات
# We use 'git diff-index' to check if there are any changes to commit.
if git diff-index --quiet HEAD --; then
    echo "لا توجد تغييرات جديدة للحفظ، سيتم محاولة رفع الحفظ (commit) السابق."
else
    echo "الخطوة 3: حفظ التغييرات الحالية..."
    git commit -m "Final setup and initial commit"
fi

# الخطوة 4: إزالة أي اتصال قديم بـ GitHub لتجنب الأخطاء
# This removes any old or incorrect remote configurations.
echo "الخطوة 4: تنظيف الإعدادات القديمة..."
git remote remove origin

# الخطوة 5: إضافة الاتصال الصحيح بمستودعك على GitHub
# This connects your local project to your GitHub repository.
echo "الخطوة 5: ربط المشروع بحسابك على GitHub..."
git remote add origin https://github.com/saeedh1986/STERPFB1.git

# الخطوة 6: رفع الكود بالقوة إلى GitHub
# This is the final step. It will ask for your username and password (Personal Access Token).
echo "================================================================="
echo "الخطوة الأخيرة: سيتم الآن رفع الكود."
echo "سيُطلب منك إدخال اسم المستخدم وكلمة المرور."
echo "اسم المستخدم: saeedh1986"
echo "كلمة المرور: استخدم رمز الوصول الشخصي (Personal Access Token) الذي أنشأته."
echo "ملاحظة: عند لصق كلمة المرور، لن تظهر على الشاشة. هذا طبيعي."
echo "================================================================="
git push --force --set-upstream origin main

echo "انتهى. إذا لم تظهر رسائل خطأ، يرجى التحقق من صفحة GitHub الخاصة بك."
