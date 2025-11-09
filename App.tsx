import React, { useState, useEffect } from "react";
import axios from "axios";
// استيراد المكونات الضرورية من React Native
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

// ----------------------------------------------------
// عناوين الخادم (ثابتة)
// ----------------------------------------------------
// عنوان نقطة نهاية التسجيل (التي تستقبل POST)
const REGISTER_URL = "https://haider7791.pythonanywhere.com/register";
// رسالة عامة للتحميل
const INITIAL_LOADING_MESSAGE = "جاري تهيئة التطبيق...";

// ----------------------------------------------------
// الكود الرئيسي للمكون
// ----------------------------------------------------
export default function App() {
  const [loading, setLoading] = useState(false); // سنستخدم هذا لحالة التحميل عند الإرسال
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [regStatus, setRegStatus] = useState(""); // حالة لإظهار رسالة نجاح/فشل التسجيل

  // دالة إرسال بيانات التسجيل (POST Request)
  const handleRegistration = async () => {
    // 1. التحقق من الإدخال
    if (!username.trim() || !email.trim()) {
      setRegStatus(
        "الرجاء تعبئة جميع الحقول: اسم المستخدم والبريد الإلكتروني."
      );
      return;
    }

    setLoading(true); // بدء التحميل
    setRegStatus("جاري إرسال بيانات التسجيل إلى الخادم...");

    try {
      // 2. استخدام axios.post لإرسال البيانات
      const response = await axios.post(REGISTER_URL, {
        username: username,
        email: email,
      });

      // 3. معالجة استجابة الخادم (نفترض أن الخادم يرجع رسالة في مفتاح 'message')
      if (response.data && response.data.message) {
        setRegStatus(`✅ نجاح: ${response.data.message}`);
        setUsername(""); // مسح الحقول بعد النجاح
        setEmail("");
        // إظهار تنبيه واضح للنجاح
        Alert.alert("نجاح التسجيل", response.data.message);
      } else {
        setRegStatus("⚠️ نجاح الاتصال، لكن تنسيق رد الخادم غير واضح.");
      }
    } catch (error: any) {
      // 4. معالجة أخطاء الاتصال (400, 500)
      const errorMessage =
        error.response?.data?.message || "خطأ غير معروف في الشبكة/الخادم.";
      setRegStatus(`❌ فشل التسجيل: ${errorMessage}`);
      // إظهار تفاصيل الخطأ في الكونسول
      console.error("خطأ التسجيل:", error);
    } finally {
      setLoading(false); // إنهاء التحميل في كل الأحوال
    }
  };

  // ----------------------------------------------------
  // منطق العرض (الواجهة الأمامية)
  // ----------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.header}>إنشاء حساب جديد</Text>
      <Text style={styles.subHeader}>التسجيل عبر نقطة النهاية /register</Text>

      {/* حقل اسم المستخدم */}
      <TextInput
        style={styles.input}
        placeholder="اسم المستخدم (Username)"
        placeholderTextColor="#999"
        onChangeText={setUsername}
        value={username}
        editable={!loading} // تعطيل الإدخال أثناء التحميل
      />

      {/* حقل البريد الإلكتروني */}
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني (Email)"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        editable={!loading}
      />

      {/* زر التسجيل */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegistration}
        disabled={loading} // تعطيل الزر أثناء التحميل
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الآن</Text>
        )}
      </TouchableOpacity>

      {/* عرض حالة التسجيل (نجاح/فشل) */}
      {regStatus ? (
        <Text
          style={[
            styles.regStatusText,
            regStatus.startsWith("✅")
              ? { color: "green" }
              : regStatus.startsWith("❌")
              ? { color: "red" }
              : { color: "#555" },
          ]}
        >
          {regStatus}
        </Text>
      ) : null}
    </View>
  );
}

// ----------------------------------------------------
// تنسيقات React Native (Styling)
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80, // مسافة علوية مناسبة لشاشات الهاتف
    paddingHorizontal: 25,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    textAlign: "right", // محاذاة النص لليمين للغة العربية
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: "#99bce3", // لون باهت عند التعطيل
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  regStatusText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
    fontWeight: "600",
  },
});
