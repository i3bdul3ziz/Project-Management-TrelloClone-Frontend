import { useState, useEffect } from "react";

const useForm = (callback, validate, props) => {
  const [signin, setSignin] = useState({});
  const [signup, setSignup] = useState({});
  const [forgetPass, setForgetPass] = useState({});
  const [resetPass, setResetPass] = useState({});
  const [editProfile, setEditProfile] = useState({
    firstName: props.user ? props.user.firstName : "",
    lastName: props.user
      ? props.user.lastName
        ? props.user.lastName
        : ""
      : "",
    email: props.user ? props.user.email : "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(signup, "signup"));
    setIsSubmitting(true);
  };

  const handleSigninSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(signin, "signin"));
    setIsSubmitting(true);
  };

  const handleForgetPassSubmit = (event) => {
    setErrors(validate(forgetPass, "forgetpass"));
    setIsSubmitting(true);
  };

  const handleResetPassSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(resetPass, "resetpass"));
    setIsSubmitting(true);
  };

  const handleEditProfileSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(editProfile, "editprofile"));
    setIsSubmitting(true);
  };

  const handleChange = (event) => {
    event.persist();
    setSignup((signup) => ({
      ...signup,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSigninChange = (event) => {
    event.persist();
    setSignin((signin) => ({
      ...signin,
      [event.target.name]: event.target.value,
    }));
  };

  const handleForgetPassChange = (event) => {
    event.persist();
    setForgetPass((forgetPass) => ({
      ...forgetPass,
      [event.target.name]: event.target.value,
    }));
  };

  const handleResetPassChange = (event) => {
    event.persist();
    setResetPass((resetPass) => ({
      ...resetPass,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditProfileChange = (event) => {
    event.persist();
    setEditProfile((editProfile) => ({
      ...editProfile,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    handleSigninSubmit,
    handleSigninChange,
    handleForgetPassChange,
    handleForgetPassSubmit,
    handleResetPassChange,
    handleResetPassSubmit,
    handleEditProfileChange,
    handleEditProfileSubmit,
    errors,
    signup,
    signin,
    forgetPass,
    resetPass,
    editProfile,
  };
};

export default useForm;
