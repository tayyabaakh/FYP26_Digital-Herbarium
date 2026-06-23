import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { applyAsBotanistApi } from '../../api/authApi';

const STEPS = [
  { n: 1, label: 'Personal Info' },
  { n: 2, label: 'Qualifications' },
  { n: 3, label: 'Documents' },
];

const BotanistApply = () => {
  const navigate = useNavigate();

  const [step,       setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);

  const [formData, setFormData] = useState({
    name:             '',
    email:            '',
    phone:            '',
    institution:      '',
    qualification:    '',
    specialisation:   '',
    experience_years: '',
    portfolio_url:    '',
    document_url:     '',
    password:         '',
    confirmPassword:  '',
  });

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name.trim())        { setError('Full name is required');      return false; }
      if (!formData.email.trim())       { setError('Email is required');          return false; }
      if (!formData.phone.trim())       { setError('Phone number is required');   return false; }
      if (!formData.institution.trim()) { setError('Institution is required');    return false; }
    }
    if (step === 2) {
      if (!formData.qualification.trim())  { setError('Qualification is required');  return false; }
      if (!formData.specialisation.trim()) { setError('Specialisation is required'); return false; }
      if (!formData.experience_years)      { setError('Experience is required');     return false; }
    }
    if (step === 3) {
      if (!formData.document_url.trim()) { setError('Document URL is required');               return false; }
      if (!formData.password)            { setError('Password is required');                   return false; }
      if (formData.password.length < 8)  { setError('Password must be at least 8 characters'); return false; }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleNext    = () => { if (validateStep()) setStep((s) => s + 1); };
  const handleBack    = () => { setError(''); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      await applyAsBotanistApi({
        name:             formData.name,
        email:            formData.email,
        phone:            formData.phone,
        institution:      formData.institution,
        qualification:    formData.qualification,
        specialisation:   formData.specialisation,
        experience_years: formData.experience_years,
        portfolio_url:    formData.portfolio_url || null,
        document_url:     formData.document_url,
        password:         formData.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans px-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <div className="text-5xl mb-5">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-7">
            Your botanist application has been received. You will be able
            to log in once an administrator reviews and approves your application.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#2d6a4f] hover:bg-[#245a41] text-white font-semibold px-7 py-3 rounded-lg text-sm cursor-pointer transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-12 py-5">
        <Link
          to="/login"
          className="text-gray-600 text-sm font-medium hover:text-gray-900 no-underline transition-colors"
        >
          ← Back to Login
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Botanist Application
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Join Pakistan's largest botanical research network
        </p>

        {/* Step Indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, idx) => (
            <div key={s.n} className="flex items-center">
              {/* Circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-semibold flex-shrink-0 transition-colors duration-200
                  ${step >= s.n
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-gray-200 text-gray-400'}
                `}
              >
                {s.n}
              </div>

              {/* Label */}
              <span
                className={`
                  ml-2 text-sm whitespace-nowrap transition-colors duration-200
                  ${step >= s.n ? 'text-[#2d6a4f]' : 'text-gray-400'}
                  ${step === s.n ? 'font-semibold' : 'font-normal'}
                `}
              >
                {s.label}
              </span>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mx-2 transition-colors duration-200
                    ${step > s.n ? 'bg-[#2d6a4f]' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-6">

          {/* ── Step 1: Personal Info ───────────────────────── */}
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <Field
                  label="Full Name"
                  placeholder="Dr. Ahmad Khan"
                  value={formData.name}
                  onChange={(v) => update('name', v)}
                />
                <Field
                  label="Email Address"
                  type="email"
                  placeholder="ahmad@institution.edu.pk"
                  value={formData.email}
                  onChange={(v) => update('email', v)}
                />
                <Field
                  label="Phone Number"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(v) => update('phone', v)}
                />
                <Field
                  label="Institution / University"
                  placeholder="University of Karachi"
                  value={formData.institution}
                  onChange={(v) => update('institution', v)}
                />
              </div>
            </>
          )}

          {/* ── Step 2: Qualifications ──────────────────────── */}
          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Qualifications
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <Field
                  label="Highest Qualification"
                  placeholder="PhD Botany"
                  value={formData.qualification}
                  onChange={(v) => update('qualification', v)}
                />
                <Field
                  label="Specialisation"
                  placeholder="Ethnobotany, Medicinal Plants..."
                  value={formData.specialisation}
                  onChange={(v) => update('specialisation', v)}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Years of Experience
                  </label>
                 <select
  value={formData.experience_years}
  onChange={(e) => update('experience_years', e.target.value ? Number(e.target.value) : '')}
  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-[#f0faf4] text-gray-900 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors"
>
  <option value="">Select years</option>
  <option value="1">1 Year</option>
  <option value="2">2 Years</option>
  <option value="3">3 Years</option>
  <option value="5">5 Years</option>
  <option value="10">10+ Years</option>
</select>
                </div>
                <Field
                  label="Portfolio / Research Link (Optional)"
                  placeholder="https://researchgate.net/..."
                  value={formData.portfolio_url}
                  onChange={(v) => update('portfolio_url', v)}
                />
              </div>
            </>
          )}

          {/* ── Step 3: Documents + Password ───────────────── */}
          {step === 3 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Documents & Account Setup
              </h3>
              <div className="grid grid-cols-1 gap-5">
                <Field
                  label="Certificate / Document URL"
                  placeholder="https://drive.google.com/... or Cloudinary URL"
                  value={formData.document_url}
                  onChange={(v) => update('document_url', v)}
                />
                <Field
                  label="Create Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(v) => update('password', v)}
                />
                <Field
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(v) => update('confirmPassword', v)}
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg px-6 py-3 text-sm cursor-pointer transition-colors"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="bg-[#2d6a4f] hover:bg-[#245a41] text-white font-semibold px-7 py-3 rounded-lg text-sm cursor-pointer transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                bg-[#2d6a4f] hover:bg-[#245a41] text-white font-semibold
                px-7 py-3 rounded-lg text-sm transition-colors
                ${submitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// ── Reusable Field ────────────────────────────────────────────
const Field = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-[#f0faf4] text-gray-900 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors box-border"
    />
  </div>
);

export default BotanistApply;