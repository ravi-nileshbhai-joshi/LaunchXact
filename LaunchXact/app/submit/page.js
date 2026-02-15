'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

export default function SubmitProduct() {
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        description: '',
        category: '',
        price: '',
        founderEmail: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        website: formData.website,
                        description: formData.description,
                        category: formData.category,
                        price: formData.price,
                        founder_email: formData.founderEmail,
                        approved: false
                    },
                ]);

            if (error) throw error;

            console.log('Product submitted:', data);
            setStatus('success');
        } catch (error) {
            console.error('Error submitting product:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            alert(`Error submitting product: ${error.message || 'Unknown error'}`);
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.container}>
                <div className={`glass-panel ${styles.successPanel}`}>
                    <div className={styles.successIcon}>🎉</div>
                    <h1>Submission Received!</h1>
                    <p>Thanks for submitting {formData.name}. We will review it shortly.</p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setFormData({ name: '', website: '', description: '', category: '', price: '', founderEmail: '' });
                            setStatus('idle');
                        }}
                    >
                        Submit another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Submit your product</h1>
                <p className={styles.subtitle}>Get in front of early adopters and get feedback.</p>
            </header>

            <div className={`glass-panel ${styles.formPanel}`}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Acme AI"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="website">Website URL</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            required
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select a category</option>
                            <option value="Developer Tools">Developer Tools</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Productivity">Productivity</option>
                            <option value="Design">Design</option>
                            <option value="Hosting">Hosting</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="price">Pricing Model</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. Free / $19/mo"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="founderEmail">Founder Email</label>
                        <input
                            type="email"
                            id="founderEmail"
                            name="founderEmail"
                            required
                            value={formData.founderEmail}
                            onChange={handleChange}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label htmlFor="description">Short Description</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What does your product do? (Max 280 chars)"
                            rows={4}
                            maxLength={280}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Submitting...' : 'Submit Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
