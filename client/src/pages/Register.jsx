import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { DIETARY_TAGS } from '../data/recipes';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', dietaryPrefs: [] });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const toggleDiet = (tag) => {
    setForm(f => ({
      ...f,
      dietaryPrefs: f.dietaryPrefs.includes(tag)
        ? f.dietaryPrefs.filter(t => t !== tag)
        : [...f.dietaryPrefs, tag],
    }));
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.email || !form.email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        dietaryPrefs: form.dietaryPrefs,
        dietType: form.dietType,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10">
              <img src={logo} alt="EatWise" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Eat<span className="text-orange-400">Wise</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white mt-4">
            {step === 1 ? 'Create your account' : 'Your food preferences'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {step === 1 ? 'Join thousands of mindful eaters' : 'Help us personalize your experience'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5 px-2">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-orange-500' : 'bg-dark-600'}`} />
          ))}
        </div>

        <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm rounded-2xl p-6 lg:p-8 animate-scale-in">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="input-field"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="input-field pr-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-300 mb-3">What is your diet type?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'veg', label: 'Vegetarian', hi: 'शाकाहारी' },
                    { id: 'nonveg', label: 'Non-Veg', hi: 'मांसाहारी' },
                    { id: 'egg', label: 'Eggetarian', hi: 'अंडाहारी' },
                    { id: 'vegan', label: 'Vegan', hi: 'शुद्ध शाकाहारी' }
                  ].map(dt => (
                    <button
                      key={dt.id}
                      onClick={() => setForm(f => ({ ...f, dietType: dt.id }))}
                      className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                        form.dietType === dt.id
                          ? 'bg-orange-600/20 border-orange-500/50 text-orange-300'
                          : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="text-center">{dt.label}</div>
                      <div className="text-xs font-normal opacity-70 text-center">{dt.hi}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-300 mb-3">Any health goals? (optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  {DIETARY_TAGS.map(tag => {
                    const selected = form.dietaryPrefs.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleDiet(tag)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all ${
                          selected
                            ? 'bg-orange-600/20 border-orange-500/50 text-orange-300'
                            : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                          selected ? 'border-orange-500 bg-orange-500' : 'border-gray-600'
                        }`}>
                          {selected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost flex-1 border border-white/10 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.dietType}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">Log in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
