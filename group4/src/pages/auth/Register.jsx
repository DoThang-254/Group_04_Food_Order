import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik'
import { checkEmail, register, updateUser } from '../../services/users';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { postStore } from '../../services/stores';
import { hashPassword } from '../../data/util';
const Register = () => {
    const RegisterSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
        ,
        email: Yup.string()
            .email('Required email format!')
            .required('Required')
            .test(
                'checkEmailUnique',
                'email already exists',
                async function (value) {
                    if (!value) return false;
                    const isUnique = await checkEmail(value);
                    return isUnique.length === 0;
                }
            ),
        dob: Yup.date()
            .required('Please enter your date of birth')
            .max(new Date(), 'Date of birth cannot be in the future'),
        phone: Yup.string().matches(/^\d{10,11}$/, 'Phone number must be 10 or 11 digits')


    });


    const navToHome = useNavigate();
    const handleSignUp = async (value) => {
        const hashedPassword = await hashPassword(value.password);
        const commonData = {
            name: `${value.firstname} ${value.lastname}`,
            email: value.email,
            phone: value.phone,
            password: hashedPassword,
            gender: value.gender,
            dob: value.dob,
            role: value.role,
            active: value.role === "customer" ? true : false
        };

        try {
            const user = await register(commonData)
            if (value.role === "owner") {
                const storeData = {
                    name: value.storeName,
                    address: value.address,
                    img: "",
                    ownerId: user.id
                }
                try {
                    const store = await postStore(storeData);
                    await updateUser(user.id, { storeId: store.id });
                    navToHome('/login');
                } catch (error) {
                    console.log(error)
                }

            }
            else {
                navToHome('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

    //option  
    const RoleDependentFields = () => {
        const { values } = useFormikContext();

        return (
            <>
                {values.role === 'owner' && (
                    <>
                        <div>
                            <label htmlFor="storeName">Store Name:</label>
                            <Field name="storeName" />
                            <ErrorMessage name="storeName" component="div" className="text-danger" />
                        </div>
                        <div>
                            <label htmlFor="address">Address:</label>
                            <Field name="address" />
                            <ErrorMessage name="address" component="div" className="text-danger" />
                        </div>
                    </>
                )}
            </>
        );
    };

    return (
        <Formik
            initialValues={{
                email: '', password: '', firstname: '',
                lastname: '', role: 'customer', store: '', phone: '', gender: 'male', dob: ''
            }}
            onSubmit={value => handleSignUp(value)}
            validationSchema={RegisterSchema}
        >
            <Form>
                <div>
                    <label htmlFor="firstname">First Name:</label>
                    <Field name="firstname" />
                    <ErrorMessage name="firstname" component={'div'} className='text-danger' />
                </div>

                <div>
                    <label htmlFor="lastname">Last Name:</label>
                    <Field name="lastname" />
                    <ErrorMessage name="lastname" component={'div'} className='text-danger' />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <Field name="phone" />
                    <ErrorMessage type="tel" name="phone" component={'div'} className='text-danger' />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <Field name="email" />
                    <ErrorMessage name="email" component={'div'} className='text-danger' />

                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <Field name="password" />
                    <ErrorMessage name="password" type="password" component={'div'} className='text-danger' />
                </div>
                <div>
                    <label htmlFor="dob">Date of Birth:</label>
                    <Field type="date" name="dob" />
                    <ErrorMessage name="dob" component="div" className="text-danger" />
                </div>

                <div>
                    <label>Gender:</label>
                    <div role="group" aria-labelledby="gender">
                        <label>
                            <Field type="radio" name="gender" value="male" />
                            Male
                        </label>
                        <label>
                            <Field type="radio" name="gender" value="female" />
                            Female
                        </label>
                        <label>
                            <Field type="radio" name="gender" value="other" />
                            Other
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="role">Role:</label>
                    <Field as="select" name="role">
                        <option value="customer">Customer</option>
                        <option value="owner">Owner</option>
                    </Field>
                </div>
                <RoleDependentFields />
                <button type='submit'>Sign Up</button>
            </Form>
        </Formik>
    );
};

export default Register;