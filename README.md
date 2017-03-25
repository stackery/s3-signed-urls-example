# Stackery Binary File Access Via Signed S3 URLs

This example shows how to provide clients access to binary files through a serverless API.

### Why?
One of the challenges of building a serverless API is handling binary data. The main serverless API platforms, like AWS API Gateway, only have ancillary support for binary data. Further, binary data handling is inefficient as the data is encoded using base64 format. Taking into account the message payload limits of AWS Lambda, the maximum size for binary request and response payloads is 4.5 KB. This may be enough for an icon, but not enough for even a reasonably sized image.

Luckily, there's another mechanism for handling binary data: redirects using AWS S3 signed URLs.

### What Are AWS S3 Signed URLs?
AWS Simple Storage Service (S3) provides storage and access to arbitrary files. Usually, you use an SDK to upload and download files from an S3 bucket. However, it is possible to generate temporary signed URLs to upload and download files using simple HTTP methods (GET, PUT, DELETE). 

These signed URLs enable you to share links to content within a private bucket. The signatures are specific to each file in the bucket, so you can have one bucket for many users of a product. By sharing signed URLs of specific files with individual users you can leverage having a private, multi-tenant store with extremely fine-grained access controls.

### OK, But How Do I Use Signed URLs?
I'm glad you asked! Let's say you have an API endpoint to retrieve an image. It's not possible to respond from a Lambda function through API Gateway with the image data. But we can send an HTTP response to the client that redirects them to the image in an S3 bucket using a signed URL:

```HTTP
HTTP/1.1 307 Temporary Redirect
Location: https://s3.amazonaws.com/mybucket/myimage.png?AWSAccessKeyId=AKISKSD87A3C4&Expires=109838429&Signature=s98df7s8df12f2jo4lfjfs9d0fu0sd9f
```

The beauty of this is that redirection for signed URLs works not only for getting files, but also for uploading and deleting files. Simply change the request method from GET to PUT or DELETE. The client, whether it's your browser or a command line tool like cURL, should respect the redirect

## Let's Get Started!

1. Fork this repo to your own account
1. Log into [Stackery](https://app.stackery.io)
1. Create a new Stackery stack
  1. Import the stack from your fork of this repo
1. Double click on the Rest Api node in the canvas and select your custom domain from the drop down
1. Deploy the stack!
