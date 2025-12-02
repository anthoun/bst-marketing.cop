import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkefmhnapikzmytyqfsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWZtaG5hcGlrem15dHlxZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjkzMjksImV4cCI6MjA4MDI0NTMyOX0.lfOtugonsVw3rF4FJTUWBHH9JP0hIFVSPPrBPYjySc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
    console.log('--- Starting Integration Tests ---');
    let errors = 0;

    // 1. Test Newsletter Subscription (Leads Table)
    console.log('\n[TEST 1] Testing Newsletter Subscription...');
    const testEmail = `test_newsletter_${Date.now()}@example.com`;
    try {
        const { error } = await supabase
            .from('leads')
            .insert({
                email: testEmail,
                type: 'newsletter'
            });

        if (error) throw error;
        console.log('✅ Newsletter lead inserted successfully.');

        // Verify insertion
        const { data: leads, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('email', testEmail);

        if (fetchError) throw fetchError;
        if (leads.length === 1 && leads[0].type === 'newsletter') {
            console.log('✅ Verified newsletter lead in database.');
        } else {
            throw new Error('Could not verify newsletter lead.');
        }
    } catch (e) {
        console.error('❌ Newsletter Test Failed:', e.message);
        errors++;
    }

    // 2. Test "Book a Call" (Leads Table)
    console.log('\n[TEST 2] Testing "Book a Call" Form...');
    const contactEmail = `test_contact_${Date.now()}@example.com`;
    try {
        const { error } = await supabase
            .from('leads')
            .insert({
                email: contactEmail,
                name: 'Test User',
                phone: '1234567890',
                message: 'This is a test message',
                type: 'contact'
            });

        if (error) throw error;
        console.log('✅ Contact lead inserted successfully.');

        // Verify insertion
        const { data: leads, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('email', contactEmail);

        if (fetchError) throw fetchError;
        if (leads.length === 1 && leads[0].type === 'contact' && leads[0].message === 'This is a test message') {
            console.log('✅ Verified contact lead in database.');
        } else {
            throw new Error('Could not verify contact lead.');
        }
    } catch (e) {
        console.error('❌ Contact Form Test Failed:', e.message);
        errors++;
    }

    // 3. Test Blog Post Creation (Posts Table)
    console.log('\n[TEST 3] Testing Blog Post Creation...');
    const testSlug = `test-post-${Date.now()}`;
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert({
                title: 'Test Blog Post',
                slug: testSlug,
                excerpt: 'Testing excerpt',
                content: '<p>Testing content</p>',
                category: 'Testing',
                status: 'published',
                published_at: new Date().toISOString(),
                seo_title: 'Test SEO Title',
                seo_description: 'Test SEO Description',
                seo_keywords: 'test, seo'
            })
            .select()
            .single();

        if (error) throw error;
        console.log('✅ Blog post created successfully.');

        // Verify insertion
        if (data.slug === testSlug && data.seo_title === 'Test SEO Title') {
            console.log('✅ Verified blog post in database.');
        } else {
            throw new Error('Could not verify blog post.');
        }

        // Cleanup Blog Post
        console.log('Cleaning up test post...');
        await supabase.from('posts').delete().eq('id', data.id);

    } catch (e) {
        console.error('❌ Blog Post Test Failed:', e.message);
        errors++;
    }

    console.log('\n--- Test Summary ---');
    if (errors === 0) {
        console.log('🎉 ALL TESTS PASSED! The website backend is fully functional.');
    } else {
        console.log(`⚠️ ${errors} tests failed. Please check the logs.`);
    }
}

runTests();
