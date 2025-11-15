"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function EnrollCourseDialog({ course }) {
  return (
    <Dialog>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button
          variant="primary"
          size="default"
          className="w-full justify-center"
        >
          Enroll Now
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Enroll Course
          </DialogTitle>
        </DialogHeader>

        {/* Course Summary */}
        <div className="border rounded-md p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">1x</span> {course.title}
          </p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {course.description}
          </p>

          <div className="flex justify-between mt-3 text-sm font-medium">
            <span>Sub total</span>
            <span>Rp{course.price.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Footer buttons */}
        <DialogFooter className="pt-4 flex justify-end gap-2">
          <Button
            variant="primary"
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={() => alert("Redirecting to payment...")}
          >
            Continue to Payment
          </Button>

          <DialogClose asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
