import React from 'react';

import Image from 'next/image';
import Dialog from '../Dialog/Dialog';
import { Crime, Media } from '@/Types/crime';

interface CrimeDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  crime: Crime;
}

const CrimeDetailsDialog: React.FC<CrimeDetailsDialogProps> = ({ open, onClose, crime }) => {
  return (
    <Dialog  isOpen={open} onClose={onClose} title='Crime Details' >
      
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Title: {crime.title}</h3>
          <p><strong>Type:</strong> {crime.type}</p>
          <p><strong>Description:</strong> {crime.description}</p>
          <p><strong>Reported By:</strong> {crime.reportedBy?.name || "Anonymous"}</p>
          <p><strong>Reported On:</strong> {new Date(crime.datetime).toLocaleString()}</p>

          <div>
            <strong>Status:</strong> 
            {crime.verificationStatus === "verified" ? (
              <span className="text-green-600">Verified</span>
            ) : crime.verificationStatus === "pending" ? (
              <span className="text-yellow-600">Pending</span>
            ) : (
              <span className="text-red-600">Rejected</span>
            )}
          </div>

          {crime.verificationRemarks && (
            <div>
              <strong>Verification Remarks:</strong> {crime.verificationRemarks}
            </div>
          )}

          {/* Media */}
          <div>
            <strong>Media:</strong>
            <div className="mt-2 mx-2 flex justify-center  items-center overflow-x-auto gap-2">
              {crime.mediaUrl?.map((media: Media) => (
                media.type === "image" ? (
                  <Image
                    key={media._id}
                    src={media.url}
                    alt={crime.title}
                    width={300}
                    height={300}
                    className="object-cover rounded-lg border px-2"
                  />
                ) : (
                  <video key={media._id} controls className="w-32 h-32 rounded-lg border">
                    <source src={media.url} type="video/mp4" />
                  </video>
                )
              ))}
            </div>
          </div>
        </div>

    </Dialog>
  );
};

export default CrimeDetailsDialog;
