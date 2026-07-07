import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from '../services/meeting.service';
import { ClientService } from '../services/client.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {
  meetings: any[] = [];
  clients: any[] = [];
  statusFilter = '';
  search = '';
  page = 1;
  totalPages = 1;
  totalItems = 0;
  loading = false;

  meetingForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedMeetingId: number | null = null;
  showModal = false;

  showDeleteModal = false;
  meetingToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMeetings();
    this.loadClients();
  }

  initForm() {
    this.meetingForm = this.fb.group({
      client_id: ['', Validators.required],
      meeting_date: ['', Validators.required],
      meeting_time: ['', Validators.required],
      meeting_type: ['Online', Validators.required],
      status: ['Upcoming', Validators.required],
      notes: ['']
    });
  }

  get f() { return this.meetingForm.controls; }

  loadMeetings() {
    this.loading = true;
    this.meetingService.getMeetings(this.page, this.statusFilter, this.search).subscribe({
      next: (data) => {
        this.meetings = data.data;
        this.page = data.current_page;
        this.totalPages = data.last_page;
        this.totalItems = data.total;
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load meetings.');
        this.loading = false;
      }
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: () => {
        this.toastService.showError('Failed to load clients dropdown data.');
      }
    });
  }

  onFilter() {
    this.page = 1;
    this.loadMeetings();
  }

  clearSearch() {
    this.search = '';
    this.onFilter();
  }

  onPageChange(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.loadMeetings();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedMeetingId = null;
    this.submitted = false;
    this.meetingForm.reset({
      meeting_type: 'Online',
      status: 'Upcoming',
      notes: ''
    });
    this.showModal = true;
  }

  openEditModal(meeting: any) {
    this.isEditMode = true;
    this.selectedMeetingId = meeting.id;
    this.submitted = false;
    this.meetingForm.patchValue({
      client_id: meeting.client_id,
      meeting_date: meeting.meeting_date,
      meeting_time: meeting.meeting_time,
      meeting_type: meeting.meeting_type,
      status: meeting.status,
      notes: meeting.notes
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.meetingForm.invalid) {
      return;
    }

    const payload = this.meetingForm.value;
    if (this.isEditMode && this.selectedMeetingId) {
      this.meetingService.updateMeeting(this.selectedMeetingId, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Meeting details updated.');
          this.closeModal();
          this.loadMeetings();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to update meeting.';
          this.toastService.showError(msg);
        }
      });
    } else {
      this.meetingService.createMeeting(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Meeting scheduled successfully.');
          this.closeModal();
          this.page = 1;
          this.loadMeetings();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to schedule meeting.';
          this.toastService.showError(msg);
        }
      });
    }
  }

  confirmDelete(meeting: any) {
    this.meetingToDelete = meeting;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.meetingToDelete = null;
    this.showDeleteModal = false;
  }

  onDelete() {
    if (this.meetingToDelete) {
      this.meetingService.deleteMeeting(this.meetingToDelete.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Meeting cancelled and deleted.');
          this.closeDeleteModal();
          this.loadMeetings();
        },
        error: () => {
          this.toastService.showError('Failed to delete meeting.');
        }
      });
    }
  }
}
