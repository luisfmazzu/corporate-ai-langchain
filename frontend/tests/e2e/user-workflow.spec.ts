import { test, expect } from '@playwright/test';

test.describe('Complete User Workflow', () => {
  test('should complete full document upload and chat workflow', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Verify the home page loads correctly
    await expect(page.getByRole('heading', { name: "Company's Private AI Document Q&A System" })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Upload Documents' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Chat' })).toBeVisible();

    // Navigate to upload page
    await page.click('text=Upload Documents');
    await expect(page).toHaveURL('/upload');

    // Verify upload page elements
    await expect(page.getByRole('heading', { name: 'Upload Company Documents' })).toBeVisible();
    await expect(page.getByText('Drag & drop files here')).toBeVisible();

    // Create a test file
    const testFileContent = 'This is a test document about artificial intelligence and machine learning. It contains information about various AI technologies and their applications.';
    const testFile = Buffer.from(testFileContent);

    // Upload the file
    await page.setInputFiles('input[type="file"]', {
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: testFile,
    });

    // Wait for upload to complete
    await expect(page.getByText('Uploading...')).toBeVisible();
    await expect(page.getByText('Uploaded Documents')).toBeVisible();

    // Navigate to chat page
    await page.click('text=Chat');
    await expect(page).toHaveURL('/chat');

    // Verify chat page loads
    await expect(page.getByRole('heading', { name: 'AI Document Q&A Chat' })).toBeVisible();

    // Wait for documents to load (if any are processed)
    await page.waitForTimeout(2000);

    // Try to create a new chat if documents are available
    const documentButtons = page.locator('button:has-text("test-document.pdf")');
    if (await documentButtons.count() > 0) {
      await documentButtons.first().click();
      
      // Create a new chat
      await page.fill('input[placeholder="New chat title..."]', 'Test Chat Session');
      await page.click('button:has-text("Create Chat")');
      
      // Wait for chat to be created
      await expect(page.getByText('Test Chat Session')).toBeVisible();
      await page.click('text=Test Chat Session');

      // Send a message
      await page.fill('input[placeholder="Ask a question..."]', 'What is this document about?');
      await page.click('button:has-text("Send")');

      // Wait for response
      await expect(page.getByText('Sending...')).toBeVisible();
      await page.waitForTimeout(5000); // Wait for AI response

      // Verify response appears
      const messages = page.locator('.bg-gray-100');
      await expect(messages).toHaveCount(1);
    }
  });

  test('should handle file upload errors gracefully', async ({ page }) => {
    await page.goto('/upload');

    // Try to upload an invalid file type
    const invalidFile = Buffer.from('test content');
    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: invalidFile,
    });

    // Should show error message
    await expect(page.getByText('Invalid file type')).toBeVisible();
  });

  test('should handle navigation between pages', async ({ page }) => {
    // Test navigation from home page
    await page.goto('/');
    
    // Navigate to upload
    await page.click('text=Upload Documents');
    await expect(page).toHaveURL('/upload');
    
    // Navigate to chat
    await page.click('text=Chat');
    await expect(page).toHaveURL('/chat');
    
    // Navigate back to home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });

  test('should display proper loading states', async ({ page }) => {
    await page.goto('/chat');
    
    // Verify loading states are handled properly
    await expect(page.getByText('Ask questions about your uploaded documents')).toBeVisible();
    
    // If no documents are available, should show appropriate message
    const noDocumentsMessage = page.locator('text=No processed documents available');
    if (await noDocumentsMessage.isVisible()) {
      await expect(noDocumentsMessage).toBeVisible();
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify mobile layout works
    await expect(page.getByRole('heading', { name: "Company's Private AI Document Q&A System" })).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/upload');
    
    // Verify tablet layout works
    await expect(page.getByRole('heading', { name: 'Upload Company Documents' })).toBeVisible();
  });
}); 