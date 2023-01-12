const AWS = require('aws-sdk');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const appId = 'd6mh781aew6yc';
    const toAddress = 'eduardo.w.marinho@gmail.com'
    const sender = 'amplify.app.zemar@gmail.com';
    const template_name = 'zemar_restaurant_created';
    const aws_region = "eu-west-1"
    const pinpointProjectId = 'f1b59fc1249142e8a65da6496e103dc1';

    AWS.config.update({ region: aws_region });

    const pinpoint = new AWS.Pinpoint();

    // Specify the parameters to pass to the API.
    var params = {
        ApplicationId: pinpointProjectId,
        MessageRequest: {
            Addresses: {
                [toAddress]: {
                    ChannelType: 'EMAIL'
                }
            },
            'MessageConfiguration': {
                'EmailMessage': { 'FromAddress': sender }
            },
            'TemplateConfiguration': {
                'EmailTemplate': {
                    'Name': template_name,
                    // 'Version': 'version-1'
                }
            }
        }
    };
    //Try to send the email.
    await pinpoint.sendMessages(params, (err, data) => {
        // If something goes wrong, print an error message.
        console.log('DATA', data);
        if (err) {
            console.log('Email wasn\'t sent', err.message);
        } else {
            console.log("Email sent! Message ID: ", data['MessageResponse']['Result'][toAddress]['MessageId']);
        }
    }).promise();
};