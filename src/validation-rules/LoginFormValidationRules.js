export default function validate(values, rule) {
  let errors = {};
  if (rule === "signup") {
    if (!values.email) {
      errors.email = "هذا الحقل مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "يجب كتابة البريد الإلكتروني بالشكل الصحيح";
    }
    if (!values.firstName) {
      errors.firstName = "هذا الحقل مطلوب";
    } else if (!/^[a-zA-Z\u0600-\u06FF]/.test(values.firstName)) {
      errors.firstName = "يجب أن يحتوي الإسم على أحرف فقط";
    }
    if (!values.password) {
      errors.password = "هذا الحقل مطلوب";
    } else if (values.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون أكثر من 8";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = "هذا الحقل مطلوب";
    }

    if (values.confirmPassword && values.password !== values.confirmPassword) {
      errors.confirmPassword = "كلمة المرور غير متطابقة";
    }
  }

  if (rule === "signin") {
    if (!values.email) {
      errors.email = "هذا الحقل مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "يجب كتابة البريد الإلكتروني بالشكل الصحيح";
    }

    if (!values.password) {
      errors.password = "هذا الحقل مطلوب";
    } else if (values.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون أكثر من 8";
    }
  }

  if (rule === "forgetpass") {
    if (!values.email) {
      errors.email = "هذا الحقل مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "يجب كتابة البريد الإلكتروني بالشكل الصحيح";
    }
  }

  if (rule === "resetpass") {
    if (!values.password) {
      errors.password = "هذا الحقل مطلوب";
    } else if (values.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون أكثر من 8";
    }
  }

  if (rule === "editprofile") {
    if (!values.email) {
      errors.email = "هذا الحقل مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "يجب كتابة البريد الإلكتروني بالشكل الصحيح";
    }
    if (!values.firstName) {
      errors.firstName = "هذا الحقل مطلوب";
    } else if (!/^[a-zA-Z\u0600-\u06FF]/.test(values.firstName)) {
      errors.firstName = "يجب أن يحتوي الإسم على أحرف فقط";
    }
  }

  return errors;
}
