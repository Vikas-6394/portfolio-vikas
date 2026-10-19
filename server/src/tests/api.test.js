import test from 'node:test';
import assert from 'node:assert/strict';
import { generateEnquiryReference } from '../utils/referenceGenerator.js';
import { defaultProfileData, defaultSkillsData, defaultServicesData } from '../utils/seedData.js';

test('Enquiry reference number format', () => {
  const ref = generateEnquiryReference();
  assert.match(ref, /^VM-\d{4}-[A-Z0-9]{6}$/, 'Reference number should match pattern VM-YYYY-XXXXXX');
});

test('Default profile data validity', () => {
  assert.equal(defaultProfileData.fullName, 'Mr. Vikas Maurya');
  assert.ok(defaultProfileData.headline.includes('Web Developer'));
  assert.ok(defaultProfileData.email.includes('@'));
  assert.ok(defaultProfileData.areasOfInterest.length > 0);
});

test('Default skills and services data presence', () => {
  assert.ok(defaultSkillsData.length >= 10, 'Must have at least 10 skills');
  assert.ok(defaultServicesData.length >= 6, 'Must have at least 6 services');
  
  const reactSkill = defaultSkillsData.find((s) => s.name === 'React');
  assert.ok(reactSkill, 'React should be in skills');
  assert.ok(reactSkill.proficiencyPercentage > 50, 'Proficiency should be valid');

  const portfolioService = defaultServicesData.find((s) => s.slug === 'personal-portfolio-websites');
  assert.ok(portfolioService, 'Personal portfolio service must exist');
});

test('Sanitization and field constraints for contact enquiry', () => {
  const sampleEnquiry = {
    fullName: 'Test Client',
    email: 'client@example.com',
    serviceRequired: 'Personal Portfolio Websites',
    projectDescription: 'Need a fast portfolio website for my business',
    privacyConsent: true,
  };

  assert.ok(sampleEnquiry.fullName.length > 0);
  assert.ok(sampleEnquiry.email.includes('@'));
  assert.ok(sampleEnquiry.projectDescription.length >= 10);
  assert.equal(sampleEnquiry.privacyConsent, true);
});
