import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AiChatComponent {
  messages: { sender: 'user' | 'assistant'; text: string }[] = [];
  // loading = false;
  responseText = '';
  promptInput = new FormControl('', [
    Validators.minLength(6),
    Validators.maxLength(640),
  ]);

  private apiService = inject(ApiService);

  sendPrompt() {
    const prompt = this.promptInput.value?.trim() ?? '';

    // Add user message to chat
    this.messages.push({ sender: 'user', text: prompt });

    this.messages.push({ sender: 'assistant', text: '...' });
    // call the Api
    this.apiService.submitPrompt('ai/prompt', prompt).subscribe({
      next: (res) => {
        console.log('AI Response', res.fullResponse);
        const aiResponse = res.fullResponse
          .replace(/^\|[-\s|]+\|$/gm, '')
          .trim();
        this.messages[this.messages.length - 1].text = aiResponse;
      },
      error: (error) => {
        console.error( 'Error', error );
        this.messages[this.messages.length -1].text = error
      },
    });

    this.promptInput.reset();
  }
}
