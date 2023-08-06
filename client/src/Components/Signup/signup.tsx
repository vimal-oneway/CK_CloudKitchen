import Container from '../Container'
import Nav from '../Nav'
import { PasswordInput, Input, Form } from '../UI/Form'
import { Divider } from '../UI/Divider'
import { Link, useNavigate } from 'react-router-dom'
import { SignUp } from '../../types/user.types'
import { signUpUser } from '../../state/slices/user.slice'
import { useAppDispatch } from '../../hooks'
import * as yup from 'yup'
import { Text } from '../UI/Text'
interface ISignupForm extends SignUp {
  repassword: string
}

function index() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    userName: yup.string().required('userName is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
    repassword: yup
      .string()
      .required('confrim Password is required')
      .min(5, 'Password must be at least 5 characters')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  })

  const onSubmit = async (data: ISignupForm) => {
    console.log(data)

    const { email, userName, password } = data
    const resultAction = await dispatch(
      signUpUser({ email, userName, password } as SignUp)
    )
    if (signUpUser.fulfilled.match(resultAction)) {
      navigate(-1)
    }
  }

  const handleGoogleLogin = () => {
    window.open(
      `${import.meta.env.VITE_REACT_SER_URL}/api/auth/google`,
      '_self'
    )
  }

  return (
    <>
      <Nav dark={true} bgColor={'#f8f8f8'} />
      <Container>
        <div className="flex justify-center min-h-[60svh]">
          <div className="w-[100%] md:w-[50%] lg:w-[40%] xl:w-[35%] flex justify-center flex-col items-center gap-4 py-2 px-2">
            <Form<ISignupForm> onSubmit={onSubmit} schema={schema}>
              {({ register, errors }) => {
                return (
                  <>
                    <div>
                      <Input type="email" {...register('email')} />
                      {errors.email && (
                        <Text
                          message={errors.email.message as string}
                          color="#EF4444"
                          size="sm"
                        />
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        {...register('userName')}
                        name="userName"
                      />
                      {errors.userName && (
                        <Text
                          message={errors.userName.message as string}
                          color="#EF4444"
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="">
                      <PasswordInput {...register('password')} />
                      {errors.password && (
                        <Text
                          message={errors.password.message as string}
                          color="#EF4444"
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="">
                      <PasswordInput
                        {...register('repassword')}
                        label="Confirm Password"
                      />
                      {errors.repassword && (
                        <Text
                          message={errors.repassword.message as string}
                          color="#EF4444"
                          size="sm"
                        />
                      )}
                    </div>
                    <Input
                      type="submit"
                      value={'Sign up'}
                      role="button"
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </>
                )
              }}
            </Form>

            <button
              className="rounded-md p-1"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                border: '#ff7e8b 2px solid',
                display: 'flex',
                justifyContent: 'center',
                margin: '  0',
                color: '#000',
                fontFamily: 'montserrat',
                backgroundColor: '#f8f8f8',
                fontWeight: '500',
                padding: '7px 6px',
              }}
            >
              <div className="flex gap-1 items-center justify-center">
                {`Google `} <i className="fa-brands fa-google text-md"></i>
              </div>
            </button>
            <Divider margin="0" color="#c1c1c1" size="1px" />
            <div className="flex items-center justify-center">
              <p className="text-[#9c9c9c] text-sm">have account already? </p>
              <Link to={'/signup'}>
                <span className="text-[#000] hover:underline cursor-pointer ml-1.5">
                  sign up
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default index
