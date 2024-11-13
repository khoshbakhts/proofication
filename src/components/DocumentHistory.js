import React, { useState } from 'react';
import { Book, HelpCircle, FileCheck, Search, Shield, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

export default function DocumentHistory() {
  const [openSection, setOpenSection] = useState('guide');
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const guides = [
    {
      title: "ثبت سند",
      icon: <FileCheck className="w-6 h-6" />,
      content: `برای ثبت سند جدید، مراحل زیر را دنبال کنید:

1. روی دکمه "ثبت سند" در منوی اصلی کلیک کنید
2. فایل مورد نظر خود را با کشیدن و رها کردن یا کلیک و انتخاب، بارگذاری کنید
3. پس از آپلود فایل، سیستم به صورت خودکار بررسی می‌کند که آیا این سند قبلاً ثبت شده است یا خیر
4. در صورتی که سند جدید باشد، فرم ثبت نمایش داده می‌شود
5. اطلاعات درخواستی شامل نام ثبت‌کننده، سازمان و شناسه را وارد کنید
6. یکی از دو روش ثبت (معمولی یا بدون گس) را انتخاب کنید
7. تراکنش را در کیف پول خود تأیید کنید
8. پس از ثبت موفق، گواهی PDF قابل دانلود خواهد بود`
    },
    {
      title: "جستجوی سند",
      icon: <Search className="w-6 h-6" />,
      content: `برای جستجو و بررسی اصالت یک سند:

1. به بخش "جستجوی سند" بروید
2. هش سند مورد نظر را وارد کنید
3. روی دکمه جستجو کلیک کنید
4. در صورت وجود سند، تمام جزئیات آن نمایش داده می‌شود:
   - نام ثبت‌کننده
   - سازمان
   - تاریخ ثبت
   - آدرس مالک
   - نوع تراکنش`
    },
    {
      title: "اتصال کیف پول",
      icon: <Wallet className="w-6 h-6" />,
      content: `برای استفاده از سامانه، نیاز به کیف پول متامسک دارید:

1. افزونه متامسک را روی مرورگر خود نصب کنید
2. یک کیف پول ایجاد کنید یا کیف پول موجود خود را وارد کنید
3. به شبکه Polygon متصل شوید
4. روی دکمه "اتصال کیف پول" در سامانه کلیک کنید
5. درخواست اتصال متامسک را تأیید کنید`
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "تفاوت ثبت معمولی و بدون گس چیست؟",
      answer: `در ثبت معمولی، شما باید هزینه تراکنش (گس) را پرداخت کنید. اما در روش بدون گس، هزینه تراکنش توسط سامانه پرداخت می‌شود. البته برای استفاده از قابلیت بدون گس، نیاز به تأیید قبلی دارید.`
    },
    {
      id: 2,
      question: "چطور می‌توانم از ثبت شدن سند خود مطمئن شوم؟",
      answer: `پس از ثبت موفق سند، یک گواهی PDF دریافت می‌کنید که حاوی تمام اطلاعات تراکنش است. همچنین می‌توانید با هش سند در بخش جستجو، اطلاعات ثبت شده را مشاهده کنید.`
    },
    {
      id: 3,
      question: "آیا می‌توان یک سند را چندبار ثبت کرد؟",
      answer: `خیر، هر سند فقط یک‌بار قابل ثبت است. اگر سندی قبلاً ثبت شده باشد، سیستم به شما اطلاع می‌دهد و جزئیات ثبت قبلی را نمایش می‌دهد.`
    },
    {
      id: 4,
      question: "اطلاعات ثبت شده در بلاکچین شامل چه مواردی است؟",
      answer: `اطلاعات ثبت شده شامل:
- هش سند (بدون محتوای اصلی فایل)
- نام ثبت‌کننده
- نام سازمان
- شناسه سند
- زمان ثبت
- آدرس کیف پول ثبت‌کننده
- نوع تراکنش (معمولی/بدون گس)`
    },
    {
      id: 5,
      question: "آیا محتوای سند من روی بلاکچین ذخیره می‌شود؟",
      answer: `خیر، فقط هش سند ذخیره می‌شود. هش یک اثر انگشت دیجیتال است و از روی آن نمی‌توان به محتوای اصلی سند دست یافت. این روش امنیت و محرمانگی اسناد شما را تضمین می‌کند.`
    }
  ];

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h2 className="guide-title">راهنمای سامانه ثبت اسناد بلاکچین</h2>
        <p className="guide-subtitle">با استفاده از این سامانه، می‌توانید اسناد خود را به صورت غیرقابل تغییر ثبت و اصالت آن‌ها را تأیید کنید.</p>
      </div>

      <div className="guide-tabs">
        <button
          className={`tab ${openSection === 'guide' ? 'active' : ''}`}
          onClick={() => setOpenSection('guide')}
        >
          <Book className="w-5 h-5" />
          راهنمای استفاده
        </button>
        <button
          className={`tab ${openSection === 'faq' ? 'active' : ''}`}
          onClick={() => setOpenSection('faq')}
        >
          <HelpCircle className="w-5 h-5" />
          سؤالات متداول
        </button>
      </div>

      <div className="guide-content">
        {openSection === 'guide' ? (
          <div className="guides">
            {guides.map((guide, index) => (
              <div key={index} className="guide-section">
                <div className="guide-section-header">
                  {guide.icon}
                  <h3>{guide.title}</h3>
                </div>
                <div className="guide-section-content">
                  {guide.content}
                </div>
              </div>
            ))}

            <div className="security-note">
              <Shield className="w-6 h-6" />
              <div>
                <h4>نکات امنیتی</h4>
                <ul>
                  <li>همیشه قبل از تأیید تراکنش، آدرس قرارداد هوشمند را بررسی کنید</li>
                  <li>کیف پول خود را در اختیار دیگران قرار ندهید</li>
                  <li>از صحت آدرس وبسایت اطمینان حاصل کنید</li>
                  <li>گواهی‌های PDF را در جای امن نگهداری کنید</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="faqs">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`faq-item ${openFaqId === faq.id ? 'open' : ''}`}
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  {openFaqId === faq.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                {openFaqId === faq.id && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}