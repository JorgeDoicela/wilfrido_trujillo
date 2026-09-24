import { Module } from '@nestjs/common';
import { DOCUMENT_AUDITOR } from './interfaces/document-auditor.interface.js';
import { HeuristicDocumentAuditorService } from './services/heuristic-document-auditor.service.js';

@Module({
  providers: [
    HeuristicDocumentAuditorService,
    {
      provide: DOCUMENT_AUDITOR,
      useExisting: HeuristicDocumentAuditorService,
    },
  ],
  exports: [DOCUMENT_AUDITOR, HeuristicDocumentAuditorService],
})
export class AuditorModule {}
