import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { checkEmail, register, updateUser } from '../../services/users';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { postStore } from '../../services/stores';
import { hashPassword } from '../../data/util';
import { useContext } from 'react';
import { themeContext } from '../../context/ThemeContext';

const Register = () => {
    const { theme } = useContext(themeContext);

    const RegisterSchema = Yup.object().shape({
        password: Yup.string()
            .required('Required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number'),
        email: Yup.string()
            .email('Required email format!')
            .required('Required')
            .test(
                'checkEmailUnique',
                'Email already exists',
                async function (value) {
                    if (!value) return false;
                    const isUnique = await checkEmail(value);
                    return isUnique.length === 0;
                }
            ),
        dob: Yup.date()
            .required('Date of birth is required')
            .test(
                'is-13-or-older',
                'You must be at least 13 years old',
                function (value) {
                    if (!value) return false;

                    const birthDate = new Date(value);
                    const today = new Date();
                    const thirteenYearsAgo = new Date();
                    thirteenYearsAgo.setFullYear(today.getFullYear() - 13);

                    return birthDate <= thirteenYearsAgo;
                }
            ),
        gender: Yup.string().required('Gender is required'),
        phone: Yup.string()
            .required('Phone is required')
            .matches(/^[0-9]{10,11}$/, 'Invalid phone number'),
        address: Yup.string().required('Address is required'),
        storeName: Yup.string().when('role', {
            is: 'owner',
            then: Yup.string().required('Store name is required'),
        }),
        storeAddress: Yup.string().when('role', {
            is: 'owner',
            then: Yup.string().required('Store address is required'),
        }),
    });

    const navToHome = useNavigate();

    const handleSignUp = async (value) => {
        console.log(value);
        const hashedPassword = await hashPassword(value.password);
        const commonData = {
            name: `${value.firstname} ${value.lastname}`,
            phone: value.phone,
            email: value.email,
            password: hashedPassword,
            gender: value.gender,
            dob: value.dob,
            role: value.role,
            birthDate: value.dob,
            address: value.address,
            active: value.role === "customer" ? true : false
        };

        try {
            const user = await register(commonData)
            if (value.role === "owner") {
                const storeData = {
                    name: value.storeName,
                    storeAddress: value.storeAddress,
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

    const RoleDependentFields = () => {
        const { values } = useFormikContext();

        return (
            <>
                {values.role === 'owner' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="storeName" className="form-label">Store Name</label>
                            <Field name="storeName" className="form-control" />
                            <ErrorMessage name="storeName" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="storeAddress" className="form-label">Store Address</label>
                            <Field name="storeAddress" className="form-control" />
                            <ErrorMessage name="storeAddress" component="div" className="text-danger" />
                        </div>
                    </>
                )}
            </>
        );
    };

    return (


        <div className={`container mt-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{ borderRadius: '8px', padding: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h3 className="mb-4 text-center">Register</h3>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                            firstname: '',
                            lastname: '',
                            role: 'customer',
                            storeName: '',
                            address: '',
                            gender: '',
                            dob: '',
                            phone: ''
                        }}
                        validationSchema={RegisterSchema}
                        onSubmit={value => handleSignUp(value)}
                    >
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <Field name="firstname" className="form-control" />
                                <ErrorMessage name="firstname" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <Field name="lastname" className="form-control" />
                                <ErrorMessage name="lastname" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field name="email" type="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <Field name="phone" className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field name="password" type="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role</label>
                                <Field as="select" name="role" className="form-select">
                                    <option value="customer">Customer</option>
                                    <option value="owner">Owner</option>
                                </Field>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dob" className="form-label">Date of Birth</label>
                                <Field type="date" name="dob" className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <Field as="select" name="gender" className="form-select">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Field>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <Field name="address" className="form-control" />
                            </div>

                            <RoleDependentFields />

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                        </Form>
                    </Formik>
                </div>

            </div>
        </div>
    );
};

export default Register;
