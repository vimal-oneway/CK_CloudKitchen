import React from "react";
import Container from "../Container";
import { Form, Input, PasswordInput } from "../UI/Form";
import Nav from "../Nav";
import * as yup from "yup";
import { Text } from "../UI/Text";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { resetPasswordApi } from "../../state/slices/user.slice";
import { IShowToast } from "../../types/showToast.types";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const appDispatch = useAppDispatch();
  const schema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .min(5, "Confirm Password must be at least 5 characters")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const onSubmit = async (data: any) => {
    if (token) {
      const resetpassword = appDispatch(
        resetPasswordApi({ token, password: data.password }),
      );

      toast.promise(
        resetpassword,
        {
          loading: "Resetting your password",
          success: (data) => {
            if (!data.payload?.success) {
              throw data.payload?.message;
            }
            navigate(-1);
            return `${data.payload?.message.trim()}`;
          },
          error: (err) => {
            return `${err}`;
          },
        },
        {
          success: {
            duration: 2000,
          },
          error: {
            duration: 2000,
          },
        },
      );
    }
  };

  return (
    <>
      <Nav dark={true} bgColor="#f8f8f8" />
      <Container>
        <div className="mx-auto max-w-sm ">
          <Text
            size="lg"
            message="Reset password"
            className="font-cardo mb-4"
          />
          <Form<{ password: string; confirmPassword: string }>
            onSubmit={onSubmit}
            schema={schema}
          >
            {({ register, errors }) => (
              <>
                <div>
                  <PasswordInput
                    {...register("password", {
                      required: true,
                      minLength: 8,
                    })}
                  />
                  {errors.password && (
                    <Text
                      message={errors.password.message as string}
                      color="#EF4444"
                      size="sm"
                    />
                  )}
                </div>
                <div>
                  <PasswordInput
                    label="Confirm Password"
                    {...register("confirmPassword", {
                      required: true,
                      minLength: 8,
                    })}
                  />
                  {errors.confirmPassword && (
                    <Text
                      message={errors.confirmPassword.message as string}
                      color="#EF4444"
                      size="sm"
                    />
                  )}
                </div>
                <Input
                  type="submit"
                  role="button"
                  style={{
                    cursor: "pointer",
                  }}
                />
              </>
            )}
          </Form>
        </div>
      </Container>
    </>
  );
};

export default ResetPassword;
