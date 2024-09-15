import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;  // Assuming this is the receiver's ID
        const senderId = req.user._id;

        // Find the conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        //SOCKET TO FUNCTIONALITY WILL GO HERE







        // Save the message to the Message collection
        await newMessage.save();

        // Push the new message's ObjectId into the conversation's messages array
        conversation.messages.push(newMessage._id);

        // Save the updated conversation
        await conversation.save();

        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if(!conversation) return res.status(200).json([])
            const messages = conversation.messages;

        res.status(200).json( messages);





    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });

    }
}